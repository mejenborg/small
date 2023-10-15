"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cdk = void 0;
const cmd_1 = require("./cmd");
class Cdk {
    constructor(opts) {
        this.verbose = false;
        if (opts?.verbose)
            this.verbose = opts.verbose;
    }
    async synth(opts) {
        const args = [];
        const execOpts = { env: {} };
        if (opts?.quiet)
            args.push('-q');
        if (opts?.output)
            args.push('--output', opts.output);
        if (opts?.app)
            args.push('--app', '.ts' === opts.app.substring(opts.app.lastIndexOf('.'))
                ? `"npx ts-node --prefer-ts-exts ${opts.app}"`
                : `"node ${opts.app}"`);
        if (opts?.name)
            execOpts.env.PROJECT_NAME = opts.name;
        if (opts?.handlers)
            execOpts.env.PROJECT_HANDLERS = opts.handlers;
        await new cmd_1.CdkSynthCmd({
            verbose: this.verbose,
        }).exec(args, execOpts);
    }
}
exports.Cdk = Cdk;
