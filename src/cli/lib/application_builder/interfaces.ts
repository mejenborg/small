export interface ApplicationBuilderOpts {
    name: string;
    cdkApp?: string;
    handlers?: string | string[];
    template?: string;
    samOutput?: string;
    cdkOutput?: string;
    dockerOutput?: string;
    builder: SupportedBuilders;
    parallel?: boolean;
}

export enum SupportedBuilders {
    SAMCLI = 'samcli',
    ESBUILD = 'esbuild',
}
