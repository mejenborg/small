"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdsVpc = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const RdsSecurityGroup_1 = require("./RdsSecurityGroup");
const RdsSubnetGroup_1 = require("./RdsSubnetGroup");
const defaults = {
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
class RdsVpc extends cdk.aws_ec2.Vpc {
    constructor(scope, id, props) {
        props = { ...defaults, ...props };
        super(scope, id, props);
        this.port = props.port;
        this.securityGroup = new RdsSecurityGroup_1.RdsSecurityGroup(scope, `RdsSecurityGroup`, {
            vpc: this,
        });
        this.subnetGroup = new RdsSubnetGroup_1.RdsSubnetGroup(scope, `RdsSubnetGroup`, {
            vpc: this,
        });
    }
}
exports.RdsVpc = RdsVpc;
