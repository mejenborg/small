"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const Cdk_1 = require("./lib/Cdk");
const Compiler_1 = require("./lib/Compiler");
const config_1 = require("./lib/config");
//import { TsNodeCmd } from './lib/TsNode';
const start = new Date().getTime();
const program = new commander_1.Command();
const verbose = true;
program.name('build');
program.description('');
program.version('0.1.0');
program.addOption(new commander_1.Option('-v, --verbose'));
program.addOption(new commander_1.Option('-n, --name <name>'));
program.addOption(new commander_1.Option('-a, --app <app>'));
program.addOption(new commander_1.Option('-h, --handlers <app>'));
//program.addOption(new Option('-e, --env <env...>'));
program.parse(process.argv);
const args = program.opts();
const main = async () => {
    process.stdout.write('Loading config...\n');
    const config = await (0, config_1.loadConfig)();
    const opts = {
        name: args.name ?? config.name,
        app: args.app ?? config.app ?? path_1.default.resolve(__dirname + '/../bin/app.ts'),
        handlers: args.handlers ?? config.handlers,
        verbose: args.verbose ?? false,
    };
    // Generate CloudFormation template
    process.stdout.write('Generating CloudFormation template...\n');
    const synthOpts = {
        app: opts.app,
        name: opts.name,
        handlers: opts.handlers,
        quiet: true,
    };
    await new Cdk_1.Cdk({
        verbose: args.verbose ?? false,
    }).synth(synthOpts);
    // Compile stack
    process.stdout.write('Compiling stack...\n');
    const buildOpts = {
        template: `${process.cwd()}/cdk.out/${opts.name}Stack.template.json`,
    };
    await new Compiler_1.Compiler({
        verbose: args.verbose ?? false,
    }).build(buildOpts);
    // await new Compiler(new SamBuild(), opts).build({
    //     template: `${process.cwd()}/cdk.out/CdkSamExampleStack.template.json`,
    // });
    //const samBuildArgs = ['-t', `${process.cwd()}/cdk.out/CdkSamExampleStack.template.json`];
    //await new SamBuildCmd(samBuildArgs).exec(opts);
    process.stdout.write(`Execution time: ${getElapsed()}\n`);
};
main();
function getElapsed() {
    let ms = new Date().getTime() - start;
    const hour = Math.floor(ms / 3600000);
    ms -= hour * 3600000;
    const min = Math.floor((ms - hour * 3600000) / 60000);
    ms -= min * 60000;
    const sec = Math.floor((ms - min * 6000) / 1000);
    ms -= sec * 1000;
    return ((hour > 0 ? ` ${hour}h` : '') +
        (min > 0 ? ` ${min}m` : '') +
        (sec > 0 ? ` ${sec}s` : '') +
        (ms > 0 ? ` ${ms}ms` : '')).trim();
}
