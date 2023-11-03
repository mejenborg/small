import { CfnFunction, CfnFunctionProps } from 'aws-cdk-lib/aws-sam';
import { Construct } from 'constructs';
import Path from 'path';
import { Api } from './Api';

type MutableApiEventProperty = {
    -readonly [key in keyof CfnFunction.ApiEventProperty]: CfnFunction.ApiEventProperty[key];
};

export class Handler extends CfnFunction {
    constructor(scope: Construct, file: string, defaultProps?: CfnFunctionProps) {
        const api = isApi(scope) ? (scope as Api) : undefined;
        scope = isApi(scope) ? scope.stack : scope;

        let properties = { ...defaultProps, ...getHandlerContents(file).properties };

        // Get relative path
        file = Path.isAbsolute(file) ? Path.relative(process.cwd(), file) : file;

        const logicalId = getLogicalId(file);
        properties = normalizeHandlerProps(file, properties);

        if (api) {
            if (properties.events) {
                for (const eventId of Object.keys(properties.events)) {
                    if (!isEventSourceProperty(properties.events, eventId)) continue;
                    if (!isApiEventProperty(properties.events[`${eventId}`].properties)) continue;
                    (<MutableApiEventProperty>properties.events[`${eventId}`].properties).restApiId = api.ref;
                }
            }
        }

        super(scope, logicalId, properties);

        //TODO: Make customizable Metadata
        // for (let [name, value] of Object.entries(metadata)) {
        //     if ('object' === typeof value) value = capitalizeMetadataKeys(value!);
        //     this.addMetadata(capitalize(name), value);
        // }

        this.addMetadata('BuildMethod', 'esbuild');
        this.addMetadata('BuildProperties', {
            UseNpmCi: true,
            Format: 'esm',
            Minify: true,
            Target: 'es2020',
            Sourcemap: true,
            EntryPoints: [file],
        });
    }
}

// function capitalize(val: string): string {
//     return val.substring(0, 1).toUpperCase() + val.substring(1);
// }
// function capitalizeMetadataKeys(obj: object): Record<string, string | string[] | number | boolean> {
//     let res = {} as Record<string, string | number | boolean>;

//     for (const [name, value] of Object.entries(obj)) {
//         if ('string' !== typeof name) continue;
//         let key = capitalize(name);
//         res[name] = value;
//     }

//     return res;
// }

function getHandlerContents(file: string): { handler: unknown; properties: CfnFunctionProps } {
    const contents = require(file);
    if (-1 == Object.keys(contents).indexOf('handler')) throw new Error(`${file} does not contain a handler`);
    if (-1 == Object.keys(contents).indexOf('properties')) throw new Error(`${file} does not contain any properties`);
    return contents;
}

function normalizeHandlerProps(file: string, props: CfnFunctionProps): CfnFunctionProps {
    return Object.assign(
        {
            handler: file.substring(0, file.lastIndexOf('.')) + '.handler',
        },
        props,
    );
}

function getLogicalId(file: string): string {
    return file.substring(0, file.lastIndexOf('.')).split('/').splice(-2).join('');
}

/* Type guards */

function isEventSourceProperty(val: unknown, key: string): val is Record<string, CfnFunction.EventSourceProperty> {
    return (
        undefined !== (<Record<string, CfnFunction.EventSourceProperty>>val)[key] &&
        undefined !== (<Record<string, CfnFunction.EventSourceProperty>>val)[key].type
    );
}

function isApiEventProperty(val: unknown): val is CfnFunction.ApiEventProperty {
    return (
        undefined !== (<CfnFunction.ApiEventProperty>val).method &&
        undefined !== (<CfnFunction.ApiEventProperty>val).path
    );
}

function isApi(api: unknown): api is Api {
    return undefined !== (<Api>api).stageName;
}
