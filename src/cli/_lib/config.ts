export interface Config {
    name?: string;
    app?: string;
    handlers?: string;
    /**
     * Specify where AWS SAM should store build artifacts
     */
    samOutput?: string;
    /**
     * Specify where cdk should store the synthesized cloud assembly files
     */
    cdkOutput?: string;
    /**
     * Specify where docker files should be stored
     */
    dockerOutput?: string;
}

export const defaults: Config = {
    samOutput: '.small/sam',
    cdkOutput: '.small/cdk',
    dockerOutput: '.small',
};

export async function loadConfig(): Promise<Config> {
    let config = await import(process.cwd() + '/small.config.js');
    return { ...defaults, ...config.default };
}
