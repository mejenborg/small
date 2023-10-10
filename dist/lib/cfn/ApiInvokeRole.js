"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiInvokeRole = void 0;
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const defaults = {
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
class ApiInvokeRole extends aws_iam_1.CfnRole {
    constructor(api, id, props) {
        props = { ...defaults, ...props };
        super(api.stack, id, props);
    }
}
exports.ApiInvokeRole = ApiInvokeRole;
