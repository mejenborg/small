import * as esbuild from 'esbuild';
import { mkdirSync } from 'fs';
import * as path from 'path';
import CloudFormation, { CfnNode } from '../../utils/CloudFormation';
import Builder from './Builder';

export interface BuildOpts {
    parallel?: boolean;
}

export default class Esbuild extends Builder {
    async build(templateFile: string, outputDir: string, opts?: BuildOpts) {
        opts = { parallel: false, ...opts };
        this.prepareOutputDir(outputDir);
        const cloudFormation = new CloudFormation(this.logger);

        const cfn = this.loadCfnTemplate(templateFile);
        const cfnFunctions = this.getCfnFunctions(cfn);

        if (opts.parallel) {
            this.logger.debug(`Building functions in parallel`);
            await Promise.all(
                Object.entries(cfnFunctions).map(([cfnFunctionName, cfnFunction]) =>
                    this.buildCfnFunction(cfnFunctionName, cfnFunction, outputDir),
                ),
            );
        } else {
            this.logger.debug(`Building functions sequentially`);
            for (const [cfnFunctionName, cfnFunction] of Object.entries(cfnFunctions)) {
                await this.buildCfnFunction(cfnFunctionName, cfnFunction, outputDir);
            }
        }

        const buildTemplatePath = path.join(outputDir, 'template.yaml');

        this.logger.info(`Persisting modified template to ${buildTemplatePath}`);
        cloudFormation.write(buildTemplatePath, cfn);
    }

    private async buildCfnFunction(cfnResourceName: string, cfnResource: CfnNode, outputDir: string) {
        const properties: any = cfnResource.Properties;
        const metadata: any = cfnResource.Metadata;

        const buildProperties: any = metadata.BuildProperties;
        const sourcemap = true === buildProperties.Sourcemap || 'true' === buildProperties.Sourcemap;
        const entryPoints = this.prepareEntryPoints(buildProperties.EntryPoints);

        if (!properties.CodeUri || '.' == properties.CodeUri) {
            this.logger.info(`Adjusting CodeUri to build name ${cfnResourceName}'`);
            properties.CodeUri = cfnResourceName;
        }

        if (sourcemap) {
            properties.Environment ??= {};
            properties.Environment.Variables ??= {};
            properties.Environment.Variables.NODE_OPTIONS ??= '';
            if (!properties.Environment.Variables.NODE_OPTIONS.includes('enable-source-maps')) {
                this.logger.info(
                    `Sourcemap set without --enable-source-maps, adding --enable-source-maps to function ${cfnResourceName} NODE_OPTIONS`,
                );
                properties.Environment.Variables.NODE_OPTIONS += ' --enable-source-maps';
            }
        }

        mkdirSync(`${outputDir}/${cfnResourceName}`, {
            recursive: true,
        });

        const esbuildOptions = {
            entryPoints: entryPoints,
            outdir: `${outputDir}/${cfnResourceName}`,
            bundle: true,
            target: buildProperties.Target,
            sourcemap: sourcemap,
            platform: 'node' as esbuild.Platform,
        };

        this.logger.info(`Executing esbuild with options: ${JSON.stringify(esbuildOptions)}`);

        await esbuild.build(esbuildOptions);
    }

    private loadCfnTemplate(templateFile: string): CfnNode {
        const cloudFormation = new CloudFormation(this.logger);
        const cf = cloudFormation.load(templateFile);
        if (!cf.Resources || 0 == Object.keys(cf.Resources).length) throw new Error('No resources found');
        return cf;
    }

    private getCfnFunctions(cfn: CfnNode) {
        let result: { [name: string]: CfnNode } = {};
        for (const [key, value] of Object.entries(cfn.Resources)) {
            const cfnResourceName: string = key;
            const cfnResource: any = value;

            if ('AWS::Serverless::Function' === cfnResource.Type) {
                this.logger.info(
                    `Found Serverless function with name='${cfnResourceName}' and codeUri='${cfnResource.Properties.CodeUri}'`,
                );
                result[cfnResourceName] = cfnResource;
            }
        }
        return result;
    }

    private prepareEntryPoints(entryPoints: string[]): string[] {
        if (!entryPoints || 0 == entryPoints.length) throw new Error('No entry points provided');
        this.logger.debug(`Appending cwd to entry points`);
        return entryPoints.map((item: string) => path.join(process.cwd(), item));
    }
}
