export interface CommandArguments {
    name?: string;
    app?: string;
    handlers?: string;
    env?: {
        [name: string]: string | number;
    };
    verbose?: boolean;
}
