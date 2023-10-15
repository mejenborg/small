import * as cdk from 'aws-cdk-lib';
type MutablSubnetGroupProps = {
    -readonly [key in keyof cdk.aws_rds.SubnetGroupProps]: cdk.aws_rds.SubnetGroupProps[key];
};
export interface RdsSubnetGroupProps extends Partial<MutablSubnetGroupProps> {
    vpc: cdk.aws_ec2.IVpc;
}
export declare class RdsSubnetGroup extends cdk.aws_rds.SubnetGroup {
    constructor(scope: cdk.Stack, id: string, props?: RdsSubnetGroupProps);
}
export {};
