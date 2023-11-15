import { CmdExecOptions, SamBuildCmd } from '../cmd';
import { BuildOptions, CompilerOptions } from './interfaces';

export class SamBuild {
    verbose: boolean = false;

    constructor(opts?: CompilerOptions) {
        if (opts?.verbose) this.verbose = opts.verbose;
    }

    async build(opts?: BuildOptions): Promise<void> {
        const args: string[] = [];
        const execOpts: CmdExecOptions = { env: {} };

        if (opts?.template) args.push('-t', opts.template);

        await new SamBuildCmd({
            verbose: this.verbose,
        }).exec(args, execOpts);
    }
}
