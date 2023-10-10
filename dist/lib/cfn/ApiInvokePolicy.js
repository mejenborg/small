"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isApiInvokePolicy = exports.ApiInvokePolicy = void 0;
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const defaults = {
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
class ApiInvokePolicy extends aws_iam_1.CfnPolicy {
    constructor(api, id, props) {
        props = { ...defaults, ...props };
        super(api.stack, id, props);
        this.api = api;
    }
}
exports.ApiInvokePolicy = ApiInvokePolicy;
/* Type guards */
function isApiInvokePolicy(val) {
    return ('object' === typeof val &&
        aws_iam_1.CfnPolicy.isCfnElement(val) &&
        aws_iam_1.CfnPolicy.isCfnResource(val) &&
        undefined !== val.api);
}
exports.isApiInvokePolicy = isApiInvokePolicy;
