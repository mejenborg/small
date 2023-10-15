import * as cdk from 'aws-cdk-lib';
import { RdsSubnetGroup } from './RdsSubnetGroup';
interface RdsVpcProps extends cdk.aws_ec2.VpcProps {
    /**
     * RDS Port number
     */
    port: number;
}
export declare class RdsVpc extends cdk.aws_ec2.Vpc {
    securityGroup: cdk.aws_ec2.SecurityGroup;
    subnetGroup: RdsSubnetGroup;
    port: number;
    constructor(scope: cdk.Stack, id: string, props?: RdsVpcProps);
}
export {};
