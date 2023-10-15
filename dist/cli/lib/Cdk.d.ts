/// <reference types="node" />
export interface CdkOptions {
    verbose?: boolean;
}
export interface SynthOptions {
    app?: string;
    name?: string;
    handlers?: string;
    quiet?: boolean;
    env?: NodeJS.ProcessEnv;
    output?: string;
}
export declare class Cdk {
    verbose: boolean;
    constructor(opts?: CdkOptions);
    synth(opts?: SynthOptions): Promise<void>;
}
