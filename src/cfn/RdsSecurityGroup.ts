import * as cdk from 'aws-cdk-lib';
import { RdsVpc } from './RdsVpc';
//import { IPeer, Port } from 'aws-cdk-lib/aws-ec2';

// export interface IngressRule {
//     peer: IPeer;
//     port: Port;
//     description?: string;
//     remoteRule?: boolean;
// }

export interface RdsSecurityGroupProps extends cdk.aws_ec2.SecurityGroupProps {
    //ingressRule?: IngressRule[];
    vpc: RdsVpc;
    port?: number;
}

const defaults: Partial<RdsSecurityGroupProps> = {
    securityGroupName: `RdsSecurityGroup`,
    description: `Allow RDS traffic`,
};

export class RdsSecurityGroup extends cdk.aws_ec2.SecurityGroup {
    constructor(scope: cdk.Stack, id: string, props: RdsSecurityGroupProps) {
        props = { ...defaults, ...props };
        super(scope, id, props);

        if (!props.port)
            this.addIngressRule(
                cdk.aws_ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
                cdk.aws_ec2.Port.tcp(props.vpc.port),
                'RDS',
            );
    }
}
