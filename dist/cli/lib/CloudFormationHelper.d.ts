export type CfnNode = {
    [key: string]: CfnNode | string | string[] | number | number[] | boolean;
};
export declare function load(file: string): CfnNode;
export declare function write(file: string, contents: CfnNode): void;
