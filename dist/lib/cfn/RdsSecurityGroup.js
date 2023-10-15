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
exports.RdsSecurityGroup = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const defaults = {
    securityGroupName: `RdsSecurityGroup`,
    description: `Allow RDS traffic`,
};
class RdsSecurityGroup extends cdk.aws_ec2.SecurityGroup {
    constructor(scope, id, props) {
        props = { ...defaults, ...props };
        super(scope, id, props);
        if (!props.port)
            this.addIngressRule(cdk.aws_ec2.Peer.ipv4(props.vpc.vpcCidrBlock), cdk.aws_ec2.Port.tcp(props.vpc.port), 'RDS');
    }
}
exports.RdsSecurityGroup = RdsSecurityGroup;
