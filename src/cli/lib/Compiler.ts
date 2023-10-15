import { Esbuild } from './compilers/Esbuild';
import { BuildOptions, CompilerOptions } from './compilers/interfaces';

//TODO: Rename to Builder
export class Compiler {
    verbose: boolean = false;

    constructor(opts?: CompilerOptions) {
        if (opts?.verbose) this.verbose = opts.verbose;
    }

    async build(opts?: BuildOptions): Promise<void> {
        // await new SamBuild({
        //     verbose: this.verbose,
        // }).build(opts);
        await new Esbuild({
            verbose: this.verbose,
        }).build(opts);
    }
}
