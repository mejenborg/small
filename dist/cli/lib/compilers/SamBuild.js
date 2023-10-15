"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamBuild = void 0;
const cmd_1 = require("../cmd");
class SamBuild {
    constructor(opts) {
        this.verbose = false;
        if (opts?.verbose)
            this.verbose = opts.verbose;
    }
    async build(opts) {
        const args = [];
        const execOpts = { env: {} };
        if (opts?.template)
            args.push('-t', opts.template);
        await new cmd_1.SamBuildCmd({
            verbose: this.verbose,
        }).exec(args, execOpts);
    }
}
exports.SamBuild = SamBuild;
