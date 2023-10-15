import { BuildOptions, CompilerOptions } from './compilers/interfaces';
export declare class Compiler {
    verbose: boolean;
    constructor(opts?: CompilerOptions);
    build(opts?: BuildOptions): Promise<void>;
}
