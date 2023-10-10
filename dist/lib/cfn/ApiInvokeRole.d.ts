import { CfnRole, CfnRoleProps } from 'aws-cdk-lib/aws-iam';
import { Api } from './Api';
export interface ApiInvokeRoleProps extends Partial<CfnRoleProps> {
}
export declare class ApiInvokeRole extends CfnRole {
    constructor(api: Api, id: string, props?: ApiInvokeRoleProps);
}
