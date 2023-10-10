import { CfnPolicy, CfnPolicyProps } from 'aws-cdk-lib/aws-iam';
import { Api } from './Api';

export interface ApiInvokePolicyProps extends Partial<CfnPolicyProps> {}

const defaults: Partial<ApiInvokePolicyProps> = {
    policyName: 'ApiInvokePolicy',
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            // {
            //     Effect: 'Allow',
            //     Action: 'iam:PassRole',
            //     Resource: [isCfnRole(this.invokeRole) ? this.invokeRole.attrArn : this.invokeRole],
            // },
            {
                Effect: 'Allow',
                Action: 'lambda:InvokeFunction',
                Resource: ['*'],
            },
        ],
    },
};

export class ApiInvokePolicy extends CfnPolicy {
    api: Api;

    constructor(api: Api, id: string, props?: ApiInvokePolicyProps) {
        props = { ...defaults, ...props };
        super(api.stack, id, props as CfnPolicyProps);
        this.api = api;
    }

    // private updatePolicyDocument() {
    //     const paths: string[] = [];

    //     for (const handler of this.api.handlers) {
    //         if (handler.events) {
    //             for (const event of Object.values(handler.events)) {
    //                 if ('api' != event.type.toLowerCase()) continue;
    //                 paths.push('/' + event.properties.method + event.properties.path);
    //             }
    //         }
    //     }

    //     console.log(paths);
    // }
}

/* Type guards */

export function isApiInvokePolicy(val: unknown): val is ApiInvokePolicy {
    return (
        'object' === typeof val &&
        CfnPolicy.isCfnElement(val) &&
        CfnPolicy.isCfnResource(val) &&
        undefined !== (<ApiInvokePolicy>val).api
    );
}
