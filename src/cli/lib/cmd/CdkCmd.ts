import { Cmd, CmdExecOptions, CmdOptions } from './Cmd';

export class CdkCmd extends Cmd {
    constructor(opts?: CmdOptions) {
        super('cdk', opts);
    }
}

export class CdkSynthCmd extends CdkCmd {
    async exec(args: ReadonlyArray<string> = [], opts?: CmdExecOptions): Promise<void> {
        await super.exec(['synth'].concat(args), opts);
    }
}
