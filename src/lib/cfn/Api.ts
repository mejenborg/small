import { CfnRole } from 'aws-cdk-lib/aws-iam';
import { CfnApi, CfnApiProps, CfnFunctionProps } from 'aws-cdk-lib/aws-sam';
import { Construct } from 'constructs';
import { globSync } from 'glob';
import * as Path from 'path';
import { ApiInvokePolicy } from './ApiInvokePolicy';
import { ApiInvokeRole } from './ApiInvokeRole';
import { Handler } from './Handler';

export interface ApiProps extends CfnApiProps {
    handlers?: string;
    defaultFunctionProps: CfnFunctionProps;
}

const defaults: Partial<ApiProps> = {};

export class Api extends CfnApi {
    invokeRole: CfnRole;
    invokePolicy: ApiInvokePolicy;
    handlers: Handler[] = [];

    constructor(scope: Construct, id: string, props?: ApiProps) {
        props = { ...defaults, ...props } as ApiProps;
        super(scope, id, props);

        this.invokeRole = new ApiInvokeRole(this, `${id}InvokeRole`);
        this.invokePolicy = new ApiInvokePolicy(this, `${id}InvokePolicy`);
        this.invokePolicy.roles = [this.invokeRole.ref];

        if (props?.handlers) this.loadHandlers(props.handlers, props.defaultFunctionProps);
    }

    async loadHandlers(pattern: string, defaultProps: CfnFunctionProps) {
        return globSync(pattern).map(async (file) => {
            this.addHandler(new Handler(this, Path.resolve(process.cwd() + '/' + file), defaultProps));
        });
    }

    async addHandler(handler: Handler) {
        this.handlers.push(handler);
    }
}
