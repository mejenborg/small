import { CfnPolicy, CfnPolicyProps } from 'aws-cdk-lib/aws-iam';
import { Api } from './Api';
export interface ApiInvokePolicyProps extends Partial<CfnPolicyProps> {
}
export declare class ApiInvokePolicy extends CfnPolicy {
    api: Api;
    constructor(api: Api, id: string, props?: ApiInvokePolicyProps);
}
export declare function isApiInvokePolicy(val: unknown): val is ApiInvokePolicy;
