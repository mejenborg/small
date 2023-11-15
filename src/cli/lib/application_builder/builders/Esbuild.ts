import * as esbuild from 'esbuild';
import { mkdirSync } from 'fs';
import * as path from 'path';
import CloudFormation from '../../utils/CloudFormation';
import Builder from './Builder';

export default class Esbuild extends Builder {
    async build(templateFile: string, outputDir: string) {
        this.prepareOutputDir(outputDir);
        const cloudFormation = new CloudFormation(this.logger);

        const cf = cloudFormation.load(templateFile);

        if (!cf.Resources || 0 == Object.keys(cf.Resources).length) throw new Error('No resources found');

        for (const [key, value] of Object.entries(cf.Resources)) {
            const name: string = key;
            const resource: any = value;

            if ('AWS::Serverless::Function' !== resource.Type) {
                this.logger.debug(`Skipping resource with name='${name}' and type='${resource.Type}'`);
                continue;
            }

            const properties: any = resource.Properties;
            const metadata: any = resource.Metadata;

            this.logger.info(`Found Serverless function with name='${name}' and codeUri='${properties.CodeUri}'`);

            const buildProperties: any = metadata.BuildProperties;
            const sourcemap = 'true' === buildProperties.Sourcemap;
            const entryPoints = this.prepareEntryPoints(buildProperties.EntryPoints);

            if (!properties.CodeUri || '.' == properties.CodeUri) {
                this.logger.info(`Adjusting CodeUri to build name ${name}'`);
                properties.CodeUri = name;
            }

            if (sourcemap) {
                if (!properties.Environment.Variables.NODE_OPTIONS.includes('enable-source-maps')) {
                    this.logger.info(
                        `Sourcemap set without --enable-source-maps, adding --enable-source-maps to function ${name} NODE_OPTIONS`,
                    );
                    properties.environment.Variables.NODE_OPTIONS ??= '';
                    properties.Environment.Variables.NODE_OPTIONS += ' --enable-source-maps';
                }
            }

            mkdirSync(`${outputDir}/${name}`, {
                recursive: true,
            });

            const esbuildOptions = {
                entryPoints: entryPoints,
                outdir: `${outputDir}/${name}`,
                bundle: true,
                target: buildProperties.Target,
                sourcemap: sourcemap,
                platform: 'node' as esbuild.Platform,
            };

            this.logger.info(`Executing esbuild with options: ${JSON.stringify(esbuildOptions)}`);

            esbuild.buildSync(esbuildOptions);
        }

        const buildTemplatePath = path.join(outputDir, 'template.yaml');

        this.logger.info(`Persisting modified template to ${buildTemplatePath}`);
        cloudFormation.write(buildTemplatePath, cf);
    }

    private prepareEntryPoints(entryPoints: string[]): string[] {
        if (!entryPoints || 0 == entryPoints.length) throw new Error('No entry points provided');
        this.logger.debug(`Appending cwd to entry points`);
        return entryPoints.map((item: string) => path.join(process.cwd(), item));
    }
}
