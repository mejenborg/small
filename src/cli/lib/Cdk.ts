import { CdkSynthCmd, CmdExecOptions } from './cmd';

export interface CdkOptions {
    verbose?: boolean;
}

export interface SynthOptions {
    app?: string;
    name?: string;
    handlers?: string;
    quiet?: boolean;
    env?: NodeJS.ProcessEnv;
    output?: string;
}

export class Cdk {
    verbose: boolean = false;

    constructor(opts?: CdkOptions) {
        if (opts?.verbose) this.verbose = opts.verbose;
    }

    async synth(opts?: SynthOptions): Promise<void> {
        const args = [];
        const execOpts: CmdExecOptions = { env: {} };

        if (opts?.quiet) args.push('-q');
        if (opts?.output) args.push('--output', opts.output);
        if (opts?.app)
            args.push(
                '--app',
                '.ts' === opts.app.substring(opts.app.lastIndexOf('.'))
                    ? `"npx ts-node --prefer-ts-exts ${opts.app}"`
                    : `"node ${opts.app}"`,
            );

        if (opts?.name) execOpts.env!.PROJECT_NAME = opts.name;
        if (opts?.handlers) execOpts.env!.PROJECT_HANDLERS = opts.handlers;

        await new CdkSynthCmd({
            verbose: this.verbose,
        }).exec(args, execOpts);
    }
}
