"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Esbuild = void 0;
const esbuild = __importStar(require("esbuild"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const CloudFormationHelper_1 = require("../helpers/CloudFormationHelper");
class Esbuild {
    constructor(opts) {
        this.verbose = false;
        if (opts?.verbose)
            this.verbose = opts.verbose;
    }
    async build(opts) {
        var _a, _b;
        if (!opts?.template) {
            throw new Error('Missing option template');
        }
        const cf = (0, CloudFormationHelper_1.load)(opts.template);
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
            if (!cf.Resources)
                throw new Error('Missing "Resources"');
            for (const [key, value] of Object.entries(cf.Resources)) {
                const logicalId = key;
                const resource = value;
                if ('AWS::Serverless::Function' == resource.Type) {
                    const properties = resource.Properties;
                    const metadata = resource.Metadata;
                    // Build Properties
                    if (!metadata.BuildProperties)
                        throw new Error('Missing "BuildProperties"');
                    const buildProperties = metadata.BuildProperties;
                    // EntryPoints
                    if (!buildProperties.EntryPoints)
                        throw new Error('Missing "EntryPoints"');
                    const entryPoints = buildProperties.EntryPoints.map((item) => path.join(root, item));
                    if (this.verbose)
                        console.log(`Found Serverless function with logical id = '${logicalId}' and codeUri = '${properties.CodeUri}'`);
                    if (!properties.CodeUri || '.' == properties.CodeUri) {
                        if (this.verbose)
                            console.log(`Adjusting CodeUri to build logical ID ${logicalId}'`);
                        properties.CodeUri = logicalId;
                    }
                    // Sourcemap
                    if (buildProperties.Sourcemap) {
                        properties.Environment ?? (properties.Environment = {});
                        (_a = properties.Environment).Variables ?? (_a.Variables = {});
                        (_b = properties.Environment.Variables).NODE_OPTIONS ?? (_b.NODE_OPTIONS = '');
                        if (!properties.Environment.Variables.NODE_OPTIONS.includes('enable-source-maps')) {
                            if (this.verbose)
                                console.log(`Sourcemap set without --enable-source-maps, adding --enable-source-maps to function ${logicalId} NODE_OPTIONS`);
                            properties.Environment.Variables.NODE_OPTIONS += ' --enable-source-maps';
                        }
                    }
                    this.buildFunction(logicalId, resource, buildDir);
                }
            }
        }
        catch (err) {
            const msg = 'string' === typeof err ? err : isError(err) ? err.message : 'unknown error type';
            throw new Error(`Malformed CloudFormation template: ${msg}`);
        }
        const buildTemplatePath = path.join(buildDir, 'template.yaml');
        (0, CloudFormationHelper_1.write)(buildTemplatePath, cf);
    }
    buildFunction(logicalId, resource, buildDir) {
        const properties = resource.Properties;
        // handler
        if (!properties?.Handler)
            throw new Error('Missing "handler"');
        const outFile = properties.Handler.match(new RegExp('([a-zA-Z0-9]+)\\.[a-zA-Z0-9]+$'))[1] + '.js';
        if (null == outFile) {
            throw new Error(`Malformed "Handler" in ${logicalId} resource`);
        }
        esbuild.buildSync({
            entryPoints: resource.Metadata?.BuildProperties?.EntryPoints,
            bundle: true,
            target: resource.Metadata?.BuildProperties?.Target,
            outfile: `${buildDir}/${logicalId}/${outFile}`,
            sourcemap: resource.Metadata?.BuildProperties?.Sourcemap,
            platform: 'node',
        });
    }
}
exports.Esbuild = Esbuild;
function isError(err) {
    return undefined !== err.message;
}
