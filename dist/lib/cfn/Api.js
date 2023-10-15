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
exports.Api = void 0;
const aws_sam_1 = require("aws-cdk-lib/aws-sam");
const glob_1 = require("glob");
const Path = __importStar(require("path"));
const ApiInvokePolicy_1 = require("./ApiInvokePolicy");
const ApiInvokeRole_1 = require("./ApiInvokeRole");
const Handler_1 = require("./Handler");
const defaults = {};
class Api extends aws_sam_1.CfnApi {
    constructor(scope, id, props) {
        props = { ...defaults, ...props };
        super(scope, id, props);
        this.handlers = [];
        this.invokeRole = new ApiInvokeRole_1.ApiInvokeRole(this, `${id}InvokeRole`);
        this.invokePolicy = new ApiInvokePolicy_1.ApiInvokePolicy(this, `${id}InvokePolicy`);
        this.invokePolicy.roles = [this.invokeRole.ref];
        if (props?.handlers)
            this.loadHandlers(props.handlers, props.defaultFunctionProps);
    }
    async loadHandlers(pattern, defaultProps) {
        return (0, glob_1.globSync)(pattern).map(async (file) => {
            this.addHandler(new Handler_1.Handler(this, Path.resolve(process.cwd() + '/' + file), defaultProps));
        });
    }
    async addHandler(handler) {
        this.handlers.push(handler);
    }
}
exports.Api = Api;
