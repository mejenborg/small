import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { load as CfnLoad, write as CfnWrite } from '../helpers/CloudFormationHelper';
import { BuildOptions, CompilerOptions } from './interfaces';

interface BuildFunctionOptions {}

type CloudFormationTemplate = {
    AWSTemplateFormatVersion?: string;
    Transform?: string;
    Description?: string;
    Resources?: { [name: string]: Resource };
};

type Resource = {
    Type?: string;
    Properties?: Properties;
    Metadata?: Metadata;
};

type Properties = {
    CodeUri?: string;
    Events?: unknown;
    Handler?: string;
    MemorySize?: Number;
    Runtime?: String;
    Timeout?: Number;
    Environment?: Environment;
};

type Metadata = {
    BuildMethod?: string;
    BuildProperties?: BuildProperties;
};

type BuildProperties = {
    EntryPoints?: string[];
    Sourcemap?: boolean | 'external' | 'linked' | 'inline' | 'both' | undefined;
    Target: string;
    Minify: boolean;
    UseNpmCi: true;
    Format: string;
};

type Environment = {
    Variables?: EnvironmentVariable;
};

type EnvironmentVariable = {
    [name: string]: string;
};

export class Esbuild {
    verbose: boolean = false;

    constructor(opts?: CompilerOptions) {
        if (opts?.verbose) this.verbose = opts.verbose;
    }

    async build(opts?: BuildOptions): Promise<void> {
        if (!opts?.template) {
            throw new Error('Missing option template');
        }

        const cf = CfnLoad(opts.template);
        const root = path.parse(opts.template).dir;

        // Build dir.
        const buildDir = opts?.buildDir
            ? path.isAbsolute(opts.buildDir)
                ? opts.buildDir
                : process.cwd() + '/' + opts.buildDir
            : process.cwd() + '/.aws-sam/build';

        fs.rmSync(buildDir, { recursive: true, force: true });

        fs.mkdirSync(buildDir, {
            recursive: true,
        });

        try {
            if (!cf.Resources) throw new Error('Missing "Resources"');

            for (const [key, value] of Object.entries(cf.Resources)) {
                const logicalId: string = key;
                const resource = value as Resource;

                if ('AWS::Serverless::Function' == resource.Type) {
                    const properties = resource.Properties as Properties;
                    const metadata = resource.Metadata as Metadata;

                    // Build Properties
                    if (!metadata.BuildProperties) throw new Error('Missing "BuildProperties"');
                    const buildProperties = metadata.BuildProperties;

                    // EntryPoints
                    if (!buildProperties.EntryPoints) throw new Error('Missing "EntryPoints"');
                    const entryPoints = buildProperties.EntryPoints.map((item: string) => path.join(root, item));

                    if (this.verbose)
                        console.log(
                            `Found Serverless function with logical id = '${logicalId}' and codeUri = '${properties.CodeUri}'`,
                        );

                    if (!properties.CodeUri || '.' == properties.CodeUri) {
                        if (this.verbose) console.log(`Adjusting CodeUri to build logical ID ${logicalId}'`);
                        properties.CodeUri = logicalId;
                    }

                    // Sourcemap
                    if (buildProperties.Sourcemap) {
                        properties.Environment ??= {};
                        properties.Environment.Variables ??= {};
                        properties.Environment.Variables.NODE_OPTIONS ??= '';

                        if (!properties.Environment.Variables.NODE_OPTIONS.includes('enable-source-maps')) {
                            if (this.verbose)
                                console.log(
                                    `Sourcemap set without --enable-source-maps, adding --enable-source-maps to function ${logicalId} NODE_OPTIONS`,
                                );
                            properties.Environment.Variables.NODE_OPTIONS += ' --enable-source-maps';
                        }
                    }

                    this.buildFunction(logicalId, resource, buildDir);
                }
            }
        } catch (err) {
            const msg = 'string' === typeof err ? err : isError(err) ? err.message : 'unknown error type';
            throw new Error(`Malformed CloudFormation template: ${msg}`);
        }

        const buildTemplatePath = path.join(buildDir, 'template.yaml');
        CfnWrite(buildTemplatePath, cf);
    }

    private buildFunction(logicalId: string, resource: Resource, buildDir: string) {
        const properties = resource.Properties;

        // handler
        if (!properties?.Handler) throw new Error('Missing "handler"');
        const outFile = properties.Handler.match(new RegExp('([a-zA-Z0-9]+)\\.[a-zA-Z0-9]+$'))![1] + '.js';
        if (null == outFile) {
            throw new Error(`Malformed "Handler" in ${logicalId} resource`);
        }

        esbuild.buildSync({
            entryPoints: resource.Metadata?.BuildProperties?.EntryPoints,
            bundle: true,
            target: resource.Metadata?.BuildProperties?.Target,
            outfile: `${buildDir}/${logicalId}/${outFile}`,
            sourcemap: resource.Metadata?.BuildProperties?.Sourcemap,
            platform: 'node' as esbuild.Platform,
        });
    }
}

function isError(err: unknown): err is Error {
    return undefined !== (<Error>err).message;
}
