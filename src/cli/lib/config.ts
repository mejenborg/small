export interface Config {
    name?: string;
    app?: string;
    handlers?: string;
}

export async function loadConfig(): Promise<Config> {
    return (await import(process.cwd() + '/small.config.js')).default;
}
