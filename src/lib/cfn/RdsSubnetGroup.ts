import * as cdk from 'aws-cdk-lib';

type MutablSubnetGroupProps = {
    -readonly [key in keyof cdk.aws_rds.SubnetGroupProps]: cdk.aws_rds.SubnetGroupProps[key];
};

export interface RdsSubnetGroupProps extends Partial<MutablSubnetGroupProps> {
    vpc: cdk.aws_ec2.IVpc;
}

const _defaults: Partial<RdsSubnetGroupProps> = {
    description: `Subnet Group to provide high availability for RDS`,
};

export class RdsSubnetGroup extends cdk.aws_rds.SubnetGroup {
    constructor(scope: cdk.Stack, id: string, props?: RdsSubnetGroupProps) {
        props = { ..._defaults, ...props } as RdsSubnetGroupProps;

        props.vpcSubnets = {
            subnets: [...props.vpc.isolatedSubnets, ...props.vpc.privateSubnets],
        };

        super(scope, id, props as cdk.aws_rds.SubnetGroupProps);
    }
}
