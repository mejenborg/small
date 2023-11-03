import { Stack } from 'aws-cdk-lib';
import { CfnDBInstance, CfnDBInstanceProps } from 'aws-cdk-lib/aws-rds';
import { RdsVpc } from './RdsVpc';

export interface DatabaseProps extends CfnDBInstanceProps {
    vpc?: RdsVpc;

    /* Required */
    dbName: string;
    engine: string;
    port: string;
}

const defaults: Partial<DatabaseProps> = {
    manageMasterUserPassword: true,
};

export class Rds extends CfnDBInstance {
    private vpc: RdsVpc;

    constructor(scope: Stack, id: string, props?: DatabaseProps) {
        props = { ...defaults, ...props } as DatabaseProps;

        super(scope, id, props);

        this.vpc =
            props.vpc ??
            new RdsVpc(scope, `RdsVpc`, {
                port: parseInt(`${props.port}`),
            });

        if (!this.vpcSecurityGroups) {
            this.vpcSecurityGroups = [this.vpc.securityGroup.securityGroupId];
        }

        if (!props.dbSubnetGroupName) {
            this.dbSubnetGroupName = this.vpc.subnetGroup.subnetGroupName;
        }
    }
}
