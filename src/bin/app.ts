#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as small from '../';

const main = async () => {
    if (!process.env.PROJECT_NAME) throw new Error('Missing env.PROJECT_NAME');
    if (!process.env.PROJECT_HANDLERS) throw new Error('Missing env.PROJECT_HANDLERS');
    const app = new cdk.App();
    const stack = new cdk.Stack(app, `${process.env.PROJECT_NAME}Stack`);
    const api = new small.Api(stack, `${process.env.PROJECT_NAME}Api`, {
        stageName: 'Prod',
        handlers: process.env.PROJECT_HANDLERS,
    });
};

main();
