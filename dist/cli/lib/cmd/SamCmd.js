"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamLocalStartApiCmd = exports.SamLocalCmd = exports.SamBuildCmd = exports.SamCmd = void 0;
const Cmd_1 = require("./Cmd");
class SamCmd extends Cmd_1.Cmd {
    constructor(opts) {
        super('sam', opts);
    }
    onStderr(context, chunk) {
        if (this.verbose)
            super.onStdout(context, chunk);
    }
}
exports.SamCmd = SamCmd;
class SamBuildCmd extends SamCmd {
    async exec(args = [], opts) {
        await super.exec(['build', '--base-dir', process.cwd()].concat(args));
    }
}
exports.SamBuildCmd = SamBuildCmd;
class SamLocalCmd extends SamCmd {
    async exec(args = [], opts) {
        await super.exec(['local'].concat(args));
    }
}
exports.SamLocalCmd = SamLocalCmd;
class SamLocalStartApiCmd extends SamLocalCmd {
    async exec(args = [], opts) {
        await super.exec(['start-api'].concat(args));
    }
}
exports.SamLocalStartApiCmd = SamLocalStartApiCmd;
