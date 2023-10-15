"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const aws_sam_1 = require("aws-cdk-lib/aws-sam");
const path_1 = __importDefault(require("path"));
class Handler extends aws_sam_1.CfnFunction {
    constructor(scope, file, defaultProps) {
        const api = isApi(scope) ? scope : undefined;
        scope = isApi(scope) ? scope.stack : scope;
        let properties = { ...defaultProps, ...getHandlerContents(file).properties };
        // Get relative path
        file = path_1.default.isAbsolute(file) ? path_1.default.relative(process.cwd(), file) : file;
        const logicalId = getLogicalId(file);
        properties = normalizeHandlerProps(file, properties);
        if (api) {
            if (properties.events) {
                for (const eventId of Object.keys(properties.events)) {
                    if (!isEventSourceProperty(properties.events, eventId))
                        continue;
                    if (!isApiEventProperty(properties.events[`${eventId}`].properties))
                        continue;
                    properties.events[`${eventId}`].properties.restApiId = api.ref;
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
exports.Handler = Handler;
function capitalize(val) {
    return val.substring(0, 1).toUpperCase() + val.substring(1);
}
// function capitalizeMetadataKeys(obj: object): Record<string, string | string[] | number | boolean> {
//     let res = {} as Record<string, string | number | boolean>;
//     for (const [name, value] of Object.entries(obj)) {
//         if ('string' !== typeof name) continue;
//         let key = capitalize(name);
//         res[name] = value;
//     }
//     return res;
// }
function getHandlerContents(file) {
    const contents = require(file);
    if (-1 == Object.keys(contents).indexOf('handler'))
        throw new Error(`${file} does not contain a handler`);
    if (-1 == Object.keys(contents).indexOf('properties'))
        throw new Error(`${file} does not contain any properties`);
    return contents;
}
function normalizeHandlerProps(file, props) {
    return Object.assign({
        handler: file.substring(0, file.lastIndexOf('.')) + '.handler',
    }, props);
}
function getLogicalId(file) {
    return file.substring(0, file.lastIndexOf('.')).split('/').splice(-2).join('');
}
/* Type guards */
function isEventSourceProperty(val, key) {
    return (undefined !== val[key] &&
        undefined !== val[key].type);
}
function isApiEventProperty(val) {
    return (undefined !== val.method &&
        undefined !== val.path);
}
function isApi(api) {
    return undefined !== api.stageName;
}
