export interface Config {
    name?: string;
    app?: string;
    handlers?: string;
}
export declare function loadConfig(): Promise<Config>;
