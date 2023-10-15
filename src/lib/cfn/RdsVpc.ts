import * as cdk from 'aws-cdk-lib';
import { RdsSecurityGroup } from './RdsSecurityGroup';
import { RdsSubnetGroup } from './RdsSubnetGroup';

interface RdsVpcProps extends cdk.aws_ec2.VpcProps {
    /**
     * RDS Port number
     */
    port: number;
}

const defaults: Partial<RdsVpcProps> = {
    cidr: '172.31.0.0/16',
    enableDnsHostnames: true,
    enableDnsSupport: true,
    subnetConfiguration: [
        {
            cidrMask: 24,
            name: 'rds',
            subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
        },
    ],
};

export class RdsVpc extends cdk.aws_ec2.Vpc {
    securityGroup: cdk.aws_ec2.SecurityGroup;
    subnetGroup: RdsSubnetGroup;
    port: number;

    constructor(scope: cdk.Stack, id: string, props?: RdsVpcProps) {
        props = { ...defaults, ...props } as RdsVpcProps;
        super(scope, id, props);

        this.port = props.port;

        this.securityGroup = new RdsSecurityGroup(scope, `RdsSecurityGroup`, {
            vpc: this,
        });

        this.subnetGroup = new RdsSubnetGroup(scope, `RdsSubnetGroup`, {
            vpc: this,
        });
    }
}
