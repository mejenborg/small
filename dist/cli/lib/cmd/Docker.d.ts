import { Cmd, CmdExecOptions, CmdOptions } from './Cmd';
export declare class DockerCmd extends Cmd {
    constructor(opts?: CmdOptions);
}
/** Docker Network */
export declare class DockerNetworkCmd extends DockerCmd {
    exec(args?: ReadonlyArray<string>, opts?: CmdExecOptions): Promise<void>;
}
export declare class DockerNetworkCreateCmd extends DockerNetworkCmd {
    exec(args?: ReadonlyArray<string>, opts?: CmdExecOptions): Promise<void>;
}
export declare class DockerNetworkCreateBridgeCmd extends DockerNetworkCreateCmd {
    exec(args?: ReadonlyArray<string>, opts?: CmdExecOptions): Promise<void>;
}
/** Docker Compose */
export declare class DockerComposeCmd extends Cmd {
    constructor(opts?: CmdOptions);
}
