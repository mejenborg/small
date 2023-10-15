import { Cmd, CmdExecOptions, CmdOptions } from './Cmd';
export declare class SamCmd extends Cmd {
    constructor(opts?: CmdOptions);
    onStderr(context: Cmd, chunk: unknown): void;
}
export declare class SamBuildCmd extends SamCmd {
    exec(args?: ReadonlyArray<string>, opts?: CmdExecOptions): Promise<void>;
}
export declare class SamLocalCmd extends SamCmd {
    exec(args?: ReadonlyArray<string>, opts?: CmdExecOptions): Promise<void>;
}
export declare class SamLocalStartApiCmd extends SamLocalCmd {
    exec(args?: ReadonlyArray<string>, opts?: CmdExecOptions): Promise<void>;
}
