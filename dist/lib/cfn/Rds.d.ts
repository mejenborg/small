import { Stack } from 'aws-cdk-lib';
import { CfnDBInstance, CfnDBInstanceProps } from 'aws-cdk-lib/aws-rds';
import { RdsVpc } from './RdsVpc';
export interface DatabaseProps extends CfnDBInstanceProps {
    vpc?: RdsVpc;
    dbName: string;
    engine: string;
    port: string;
}
export declare class Rds extends CfnDBInstance {
    private vpc;
    constructor(scope: Stack, id: string, props?: DatabaseProps);
}
