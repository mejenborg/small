import { CfnFunction, CfnFunctionProps } from 'aws-cdk-lib/aws-sam';
import { Construct } from 'constructs';
export declare class Handler extends CfnFunction {
    constructor(scope: Construct, file: string, defaultProps?: CfnFunctionProps);
}
