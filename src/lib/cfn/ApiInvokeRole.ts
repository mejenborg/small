import { CfnRole, CfnRoleProps } from 'aws-cdk-lib/aws-iam';
import { Api } from './Api';

export interface ApiInvokeRoleProps extends Partial<CfnRoleProps> {}

const defaults: ApiInvokeRoleProps = {
    assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Effect: 'Allow',
                Principal: {
                    Service: ['apigateway.amazonaws.com'],
                    Action: ['sts:AssumeRole'],
                },
            },
        ],
    },
};

export class ApiInvokeRole extends CfnRole {
    constructor(api: Api, id: string, props?: ApiInvokeRoleProps) {
        props = { ...defaults, ...props };
        super(api.stack, id, props as CfnRoleProps);
    }
}
