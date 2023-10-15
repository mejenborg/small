import { CfnRole } from 'aws-cdk-lib/aws-iam';
import { CfnApi, CfnApiProps, CfnFunctionProps } from 'aws-cdk-lib/aws-sam';
import { Construct } from 'constructs';
import { ApiInvokePolicy } from './ApiInvokePolicy';
import { Handler } from './Handler';
export interface ApiProps extends CfnApiProps {
    handlers?: string;
    defaultFunctionProps: CfnFunctionProps;
}
export declare class Api extends CfnApi {
    invokeRole: CfnRole;
    invokePolicy: ApiInvokePolicy;
    handlers: Handler[];
    constructor(scope: Construct, id: string, props?: ApiProps);
    loadHandlers(pattern: string, defaultProps: CfnFunctionProps): Promise<Promise<void>[]>;
    addHandler(handler: Handler): Promise<void>;
}
