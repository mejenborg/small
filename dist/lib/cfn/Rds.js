"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rds = void 0;
const aws_rds_1 = require("aws-cdk-lib/aws-rds");
const RdsVpc_1 = require("./RdsVpc");
const defaults = {
    manageMasterUserPassword: true,
};
class Rds extends aws_rds_1.CfnDBInstance {
    constructor(scope, id, props) {
        props = { ...defaults, ...props };
        super(scope, id, props);
        this.vpc =
            props.vpc ??
                new RdsVpc_1.RdsVpc(scope, `RdsVpc`, {
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
exports.Rds = Rds;
