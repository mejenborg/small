"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const Esbuild_1 = require("./compilers/Esbuild");
//TODO: Rename to Builder
class Compiler {
    constructor(opts) {
        this.verbose = false;
        if (opts?.verbose)
            this.verbose = opts.verbose;
    }
    async build(opts) {
        // await new SamBuild({
        //     verbose: this.verbose,
        // }).build(opts);
        await new Esbuild_1.Esbuild({
            verbose: this.verbose,
        }).build(opts);
    }
}
exports.Compiler = Compiler;
