import { Command, Help, Option } from 'commander';
import { existsSync } from 'fs';
import path from 'path';
import winston from 'winston';
import ApplicationBuilder, {
    ApplicationBuilderOpts,
    SupportedBuilders,
    defaultBuildOpts,
} from './lib/application_builder';
import Timer from './lib/utils/Timer';

const timer = new Timer();

// command config
const appProjectFileSequence = ['cdk.ts', 'cdk.js', 'template.yaml', 'template.yml', 'template.json'];

// Tmp
let i = 0;

const command = new Command();
command.name('build');
command.description(
    'Build the serverless application\n\n' +
        'If neither --cdk-app or --template is provided, application project file is loaded via (in order of precedence):\n' +
        appProjectFileSequence.map((file) => ` ${++i}. ${file}`).join('\n'),
);
command.addHelpText(
    'after',
    `\nExamples\n` +
        `  $ small ${command.name()} -t template.yaml           Build from a CloudFormation template.\n` +
        `  $ small ${command.name()} -a ./cdk.ts                Build custom CDK stack.\n` +
        `  $ small ${command.name()} -l src/handlers/**/*.ts    Build application with default cdk stack only supplying handlers location.`,
);
command.version('0.1.0');

command.showHelpAfterError('(add --help for additional information)');

command.addOption(new Option('-n, --name <name>', 'Application name.'));
command.addOption(
    new Option('-a, --cdk-app <path>', 'CDK app file. This option cannot be used with --template').default(
        false,
        `"app.[ts|js]"`,
    ),
);
command.addOption(
    new Option(
        '-l, --handlers <paths...>',
        'Filenames or patterns to locate handlers. These filenames are resolved relative to the directory containing the small.config file. This option cannot be used with --template',
    ),
);
command.addOption(
    new Option(
        '-t, --template <paths>',
        'AWS SAM template file. This option cannot be used with --cdk-app or --handlers',
    )
        .default(false, `"template.[yaml|yml|json]"`)
        .conflicts(['cdkApp', 'handlers']),
);
command.addOption(
    new Option(
        '-so, --sam-output <dir>',
        'Directory to store build SAM artifacts. Note: This directory will be removed before starting a build.',
    ).default(defaultBuildOpts.samOutput),
);
command.addOption(
    new Option(
        '-co, --cdk-output <dir>',
        'Directory to store CDK synth artifacts. Note: This directory will be removed before starting a build.',
    ).default(defaultBuildOpts.cdkOutput),
);
command.addOption(
    new Option(
        '-do, --docker-output <dir>',
        'Directory to store Docker template artifacts. Note: This directory will be removed before starting a build.',
    ).default(defaultBuildOpts.dockerOutput),
);
command.addOption(
    new Option('-b, --builder <builder>', 'Specify which builder to use')
        .choices(Object.values(SupportedBuilders))
        .default(SupportedBuilders.ESBUILD),
);
command.addOption(new Option('-p, --parallel', 'Enable parallel build of handlers'));
command.addOption(new Option('-v, --verbose', 'Turn on debug logging to print debug message'));

command.parse(process.argv);

// Initializing logger
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.printf(({ message, level }) => `[${level}] ${message}`)),
    transports: [
        new winston.transports.Stream({
            stream: process.stdout,
            level: 'debug',
        }),
    ],
});

// Prepare Action options
const opts = command.opts() as ApplicationBuilderOpts;

if (!opts.cdkApp && !opts.template) {
    logger.debug(`Neither option -a, --cdk-app or -t, --template is set, will try to find application project file`);

    const appProjectFile = appProjectFileSequence
        .map((file) => path.resolve(process.cwd() + '/' + file))
        .find((file) => {
            if (existsSync(file)) {
                logger.debug(`Found application project file ${path.relative(process.cwd(), file)}`);
                return file;
            }
        });

    if (!appProjectFile) throw new Error('No application project found.');

    const fileType = appProjectFile.substring(appProjectFile.lastIndexOf('.'));

    if (0 <= ['.ts', '.js'].indexOf(fileType)) {
        logger.debug(`Adding option --cdk-app ${appProjectFile}`);
        opts.cdkApp = appProjectFile;
    } else if (0 <= ['.yaml', '.yml', '.json'].indexOf(fileType)) {
        logger.debug(`Adding option --template ${appProjectFile}`);
        opts.template = appProjectFile;
    }
}

// Execute action
const action = new ApplicationBuilder(logger, opts);
action
    .build()
    .then(() => {
        logger.info(`Execution time: ${timer.getElapsed()}\n`);
    })
    .catch((err) => {
        const help: Help = command.createHelp();
        let msg = help.formatHelp(command, help);
        command.error(msg + '\nError: ' + (isError(err) ? err.message : `${err}`));
    });

function isError(val: unknown): val is Error {
    return undefined !== (<Error>val).message;
}
