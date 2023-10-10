"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkSynthCmd = exports.CdkCmd = void 0;
const Cmd_1 = require("./Cmd");
class CdkCmd extends Cmd_1.Cmd {
    constructor(opts) {
        super('cdk', opts);
    }
}
exports.CdkCmd = CdkCmd;
class CdkSynthCmd extends CdkCmd {
    async exec(args = [], opts) {
        await super.exec(['synth'].concat(args), opts);
    }
}
exports.CdkSynthCmd = CdkSynthCmd;
