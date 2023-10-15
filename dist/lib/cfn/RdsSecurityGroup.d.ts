import * as cdk from 'aws-cdk-lib';
import { RdsVpc } from './RdsVpc';
export interface RdsSecurityGroupProps extends cdk.aws_ec2.SecurityGroupProps {
    vpc: RdsVpc;
    port?: number;
}
export declare class RdsSecurityGroup extends cdk.aws_ec2.SecurityGroup {
    constructor(scope: cdk.Stack, id: string, props: RdsSecurityGroupProps);
}
