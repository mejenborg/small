import { Command, Option } from 'commander';
import Path from 'path';
import { Cdk, SynthOptions } from './lib/Cdk';
import { Compiler } from './lib/Compiler';
import { Config, loadConfig } from './lib/config';
import { createDockerFromCfn } from './lib/helpers/DockerHelper';

const start = new Date().getTime();

const program = new Command();

const verbose = true;

program.name('build');
program.description('');
program.version('0.1.0');

program.addOption(new Option('-v, --verbose'));
program.addOption(new Option('-n, --name <name>'));
program.addOption(new Option('-a, --app <app>'));
program.addOption(new Option('-h, --handlers <app>'));
program.addOption(new Option('-o, --output <path>', 'Directory to store application artifacts'));
//program.addOption(new Option('-e, --env <env...>'));

program.parse(process.argv);

export interface CommandArguments {
    name?: string;
    app?: string;
    handlers?: string;
    env?: { [name: string]: string | number };
    verbose?: boolean;
}

interface BuildOptions {
    name?: string;
}

const args = program.opts() as CommandArguments;

const main = async () => {
    process.stdout.write('Loading config...\n');
    const config: Config = await loadConfig();

    const cdkOutput = config.cdkOutput ? config.cdkOutput : 'cdk.out';
    const samOutput = config.samOutput ? config.samOutput : '.aws-sam';
    const dockerOutput = config.dockerOutput ? config.dockerOutput : './';

    const opts = {
        name: args.name ?? config.name,
        app: args.app ?? config.app ?? Path.resolve(__dirname + '/../bin/app.ts'),
        handlers: args.handlers ?? config.handlers,
        verbose: args.verbose ?? false,
    };

    // Generate CloudFormation template
    process.stdout.write('Generating CloudFormation template...\n');
    const synthOpts: SynthOptions = {
        app: opts.app,
        name: opts.name,
        handlers: opts.handlers,
        quiet: true,
        output: cdkOutput,
    };
    await new Cdk({
        verbose: args.verbose ?? false,
    }).synth(synthOpts);

    // Generate Docker for local dev env.
    createDockerFromCfn(`${cdkOutput}/${opts.name}Stack.template.json`, dockerOutput);

    // Compile stack
    process.stdout.write('Compiling stack...\n');
    const buildOpts = {
        template: `${cdkOutput}/${opts.name}Stack.template.json`,
        buildDir: samOutput,
    };
    await new Compiler({
        verbose: args.verbose ?? false,
    }).build(buildOpts);

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

    return (
        (hour > 0 ? ` ${hour}h` : '') +
        (min > 0 ? ` ${min}m` : '') +
        (sec > 0 ? ` ${sec}s` : '') +
        (ms > 0 ? ` ${ms}ms` : '')
    ).trim();
}
