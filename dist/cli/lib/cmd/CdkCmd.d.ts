import { Cmd, CmdExecOptions, CmdOptions } from './Cmd';
export declare class CdkCmd extends Cmd {
    constructor(opts?: CmdOptions);
}
export declare class CdkSynthCmd extends CdkCmd {
    exec(args?: ReadonlyArray<string>, opts?: CmdExecOptions): Promise<void>;
}
