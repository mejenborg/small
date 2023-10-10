/// <reference types="node" />
export interface CmdOptions {
    verbose?: boolean;
}
export interface CmdExecOptions {
    env?: NodeJS.ProcessEnv;
}
export declare class Cmd {
    command: string;
    verbose: boolean;
    constructor(command: string, opts?: CmdOptions);
    exec(args: ReadonlyArray<string>, opts?: CmdExecOptions): Promise<void>;
    onStdout(context: Cmd, chunk: unknown): void;
    onStderr(context: Cmd, chunk: unknown): void;
}
