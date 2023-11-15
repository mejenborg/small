import { Cmd, CmdExecOptions, CmdOptions } from './Cmd';

export class DockerCmd extends Cmd {
    constructor(opts?: CmdOptions) {
        super('docker', opts);
    }
}

/** Docker Network */

export class DockerNetworkCmd extends DockerCmd {
    async exec(args: ReadonlyArray<string> = [], opts?: CmdExecOptions): Promise<void> {
        await super.exec(['network'].concat(args), opts);
    }
}

export class DockerNetworkCreateCmd extends DockerNetworkCmd {
    async exec(args: ReadonlyArray<string> = [], opts?: CmdExecOptions): Promise<void> {
        await super.exec(['create'].concat(args), opts);
    }
}

export class DockerNetworkCreateBridgeCmd extends DockerNetworkCreateCmd {
    async exec(args: ReadonlyArray<string> = [], opts?: CmdExecOptions): Promise<void> {
        await super.exec(['-d', 'bridge'].concat(args), opts);
    }
}

/** Docker Compose */

export class DockerComposeCmd extends Cmd {
    constructor(opts?: CmdOptions) {
        super('docker-compose', opts);
    }
}
