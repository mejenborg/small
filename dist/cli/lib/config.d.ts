export interface Config {
    name?: string;
    app?: string;
    handlers?: string;
    /**
     * Specify where AWS SAM should store build artifacts
     * Set to false for default location (./.aws-sam)
     */
    samOutput?: string;
    /**
     * Specify where cdk should store the synthesized cloud assembly files
     * Set to false for default location (./cdk.out)
     */
    cdkOutput?: string;
    /**
     * Specify where docker files should be stored
     * Set to false for default location (./)
     */
    dockerOutput?: string;
}
export declare const defaults: Config;
export declare function loadConfig(): Promise<Config>;
