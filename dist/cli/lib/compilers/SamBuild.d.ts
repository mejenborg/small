import { BuildOptions, CompilerOptions } from './interfaces';
export declare class SamBuild {
    verbose: boolean;
    constructor(opts?: CompilerOptions);
    build(opts?: BuildOptions): Promise<void>;
}
