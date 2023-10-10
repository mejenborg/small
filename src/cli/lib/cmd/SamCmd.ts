import { Cmd, CmdExecOptions, CmdOptions } from './Cmd';

export class SamCmd extends Cmd {
    constructor(opts?: CmdOptions) {
        super('sam', opts);
    }

    onStderr(context: Cmd, chunk: unknown) {
        if (this.verbose) super.onStdout(context, chunk);
    }
}

export class SamBuildCmd extends SamCmd {
    async exec(args: ReadonlyArray<string> = [], opts?: CmdExecOptions): Promise<void> {
        await super.exec(['build', '--base-dir', process.cwd()].concat(args));
    }
}
