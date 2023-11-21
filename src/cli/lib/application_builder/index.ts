import {
    ArtifactManifest,
    ArtifactType,
    AwsCloudFormationStackProperties,
    Manifest,
} from 'aws-cdk-lib/cloud-assembly-schema';
import { existsSync } from 'fs';
import winston from 'winston';
import Cdk from '../utils/Cdk';
import Builder from './builders/Builder';
import Esbuild from './builders/Esbuild';
import Samcli from './builders/Samcli';
import { IncompatibleOptionsCombinationError, MissingOptionError, UnsupportedApplicationBuilder } from './exceptions';
import { ApplicationBuilderOpts, SupportedBuilders } from './interfaces';

export * from './interfaces';

export const defaultBuildOpts: Partial<ApplicationBuilderOpts> = {
    samOutput: '.small/sam-output',
    cdkOutput: '.small/cdk-output',
    builder: SupportedBuilders.ESBUILD,
};

export default class ApplicationBuilder {
    logger: winston.Logger;
    name: string;
    cdkApp?: string;
    handlers?: string | string[];
    template?: string;
    samOutput?: string;
    cdkOutput?: string;
    builder: SupportedBuilders;
    parallel?: boolean;

    private stacks: ArtifactManifest[];

    constructor(logger: winston.Logger, opts: ApplicationBuilderOpts) {
        if (!opts.cdkApp && !opts.template) {
            throw new MissingOptionError('Either a cdkApp or template needs to be provided');
        }

        if (opts.cdkApp && opts.template) {
            if (opts.cdkApp) throw new IncompatibleOptionsCombinationError('cdkApp', 'template');
            if (opts.handlers) throw new IncompatibleOptionsCombinationError('template', 'handlers');
        }

        opts = { ...defaultBuildOpts, ...opts };

        this.logger = logger;
        this.name = opts.name;
        this.cdkApp = opts.cdkApp;
        this.handlers = opts.handlers;
        this.template = opts.template;
        this.samOutput = opts.samOutput;
        this.cdkOutput = opts.cdkOutput;
        this.builder = opts.builder;
        this.parallel = opts.parallel;
    }

    async build() {
        const stacks = (await this.cdkSynth()) ?? this.createStackFromTemplate();

        if (!stacks) throw new Error('No stacks found to build');

        if (this.parallel) {
            this.logger.debug('Building stacks in parallel');
            await Promise.all(stacks.map((stack) => this.buildStack(stack)));
        } else {
            this.logger.debug('Building stacks sequentially');
            for (const stack of stacks) {
                await this.buildStack(stack);
            }
        }
    }

    async buildStack(stack: ArtifactManifest) {
        this.logger.info(`Building stack ${stack.displayName}`);

        if (!isAwsCloudFormationStackProperties(stack.properties)) throw new Error('Not a stack');

        const templateFile = this.cdkOutput + '/' + stack.properties.templateFile;
        if (!existsSync(templateFile)) throw new Error(`CloudFormation template ${templateFile} does not exist`);

        let builder = this.getBuilder();

        await builder.build(templateFile, this.samOutput!, { parallel: this.parallel });
    }

    getBuilder(): Builder {
        switch (this.builder) {
            case SupportedBuilders.SAMCLI:
                this.logger.info('Building application using SAM CLI');
                return new Samcli(this.logger);
            case SupportedBuilders.ESBUILD:
                this.logger.info('Building application using esbuild');
                return new Esbuild(this.logger);
            default:
                throw new UnsupportedApplicationBuilder(this.builder);
        }
    }

    createStackFromTemplate() {
        if (this.template) {
            this.logger.info(`Creating stack from template ${this.template}`);

            return [
                {
                    type: ArtifactType.AWS_CLOUDFORMATION_STACK,
                    properties: {
                        templateFile: this.template,
                    },
                    displayName: this.name ?? 'AwsSamStack',
                },
            ];
        }
    }

    async cdkSynth(): Promise<ArtifactManifest[] | undefined> {
        if (this.cdkApp) {
            this.logger.info(`Synthesizing CDK app ${this.cdkApp} to ${this.cdkOutput}`);
            let cdk = new Cdk(this.logger);
            await cdk.synth(this.cdkApp, this.cdkOutput!);
            return this.getCdkSynthStacks();
        } else return undefined;
    }

    getCdkSynthStacks() {
        const manifestFile = this.cdkOutput! + '/manifest.json';
        if (!existsSync(manifestFile)) throw new Error(`Cdk synthed manifest ${manifestFile} does not exist`);

        const manifest = Manifest.loadAssemblyManifest(manifestFile);

        if ('object' != typeof manifest) throw new Error('Not a valid cdk synthed manifest object');
        if (!manifest.artifacts) throw new Error('Cdk synthed manifest is missing artifacts');

        let stacks: ArtifactManifest[] = [];

        for (const [name, artifact] of Object.entries(manifest.artifacts)) {
            if ('object' != typeof artifact) throw new Error(`Cdk synthed manifest artifact ${name} is not an object`);
            if (!artifact.type) throw new Error(`Cdk synthed manifest artifact ${name} is missing a type`);

            if (artifact.type == 'aws:cloudformation:stack') {
                this.logger.info(`Found cdk synthed stack ${name}`);
                stacks.push(artifact);
            }
        }

        return stacks;
    }
}

function isAwsCloudFormationStackProperties(obj: any): obj is AwsCloudFormationStackProperties {
    return obj.templateFile !== undefined;
}
