"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerComposeCmd = exports.DockerNetworkCreateBridgeCmd = exports.DockerNetworkCreateCmd = exports.DockerNetworkCmd = exports.DockerCmd = void 0;
const Cmd_1 = require("./Cmd");
class DockerCmd extends Cmd_1.Cmd {
    constructor(opts) {
        super('docker', opts);
    }
}
exports.DockerCmd = DockerCmd;
/** Docker Network */
class DockerNetworkCmd extends DockerCmd {
    async exec(args = [], opts) {
        await super.exec(['network'].concat(args), opts);
    }
}
exports.DockerNetworkCmd = DockerNetworkCmd;
class DockerNetworkCreateCmd extends DockerNetworkCmd {
    async exec(args = [], opts) {
        await super.exec(['create'].concat(args), opts);
    }
}
exports.DockerNetworkCreateCmd = DockerNetworkCreateCmd;
class DockerNetworkCreateBridgeCmd extends DockerNetworkCreateCmd {
    async exec(args = [], opts) {
        await super.exec(['-d', 'bridge'].concat(args), opts);
    }
}
exports.DockerNetworkCreateBridgeCmd = DockerNetworkCreateBridgeCmd;
/** Docker Compose */
class DockerComposeCmd extends Cmd_1.Cmd {
    constructor(opts) {
        super('docker-compose', opts);
    }
}
exports.DockerComposeCmd = DockerComposeCmd;
