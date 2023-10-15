import { BuildOptions, CompilerOptions } from './interfaces';
export declare class Esbuild {
    verbose: boolean;
    constructor(opts?: CompilerOptions);
    build(opts?: BuildOptions): Promise<void>;
    private buildFunction;
}
