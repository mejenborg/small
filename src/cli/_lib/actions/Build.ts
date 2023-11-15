import winston from 'winston';
import BaseAction, { BaseExecOpts } from './BaseAction';

export interface BuildExecOpts extends BaseExecOpts {
    name: string;
    cdkApp?: string;
    handlers?: string | string[];
    template?: string;
    samOutput?: string;
    cdkOutput?: string;
    dockerOutput?: string;
    compiler?: string;
}

export const buildExecDefaultOpts: Partial<BuildExecOpts> = {
    samOutput: '.small/sam',
    cdkOutput: '.small/cdk',
    dockerOutput: '.small',
};

export default class Build extends BaseAction {
    verbose: boolean = false;
    logger: winston.Logger;

    async exec(opts: BuildExecOpts) {
        if ((opts.cdkApp || opts.handlers) && opts.template) {
            if (opts.cdkApp) throw new IncompatibleOptionsCombinationError('cdkApp', 'template');
            if (opts.handlers) throw new IncompatibleOptionsCombinationError('template', 'handlers');
        }

        this.verbose = opts.verbose ?? false;

        await this.cdkSynth();
        await this.createDockerCompose();
        await this.buildApplication();
    }

    async cdkSynth() {
        this.logger.info(`Running Build.cdkSynth`);
    }

    async createDockerCompose() {
        this.logger.info(`Running Build.createDockerCompose`);
    }

    async buildApplication() {
        this.logger.info(`Running Build.buildApplication`);
    }
}

class IncompatibleOptionsCombinationError extends Error {
    constructor(name1: string, name2: string) {
        super(`BuildExecOpts.${name1} cannot be used with BuildExecOpts.${name2}`);
    }
}
