export interface CompilerOptions {
    verbose?: boolean;
}
export interface BuildOptions {
    template?: string;
    buildDir?: string;
}
export declare class Compiler {
    verbose: boolean;
    constructor(opts?: CompilerOptions);
    build(opts?: BuildOptions): Promise<void>;
}
