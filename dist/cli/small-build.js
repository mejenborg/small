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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
const application_builder_1 = __importStar(require("./lib/application_builder"));
const Timer_1 = __importDefault(require("./lib/utils/Timer"));
const timer = new Timer_1.default();
// command config
const appProjectFileSequence = ['cdk.ts', 'cdk.js', 'template.yaml', 'template.yml', 'template.json'];
// Tmp
let i = 0;
const command = new commander_1.Command();
command.name('build');
command.description('Build the serverless application\n\n' +
    'If neither --cdk-app or --template is provided, application project file is loaded via (in order of precedence):\n' +
    appProjectFileSequence.map((file) => ` ${++i}. ${file}`).join('\n'));
command.addHelpText('after', `\nExamples\n` +
    `  $ small ${command.name()} -t template.yaml           Build from a CloudFormation template.\n` +
    `  $ small ${command.name()} -a ./cdk.ts                Build custom CDK stack.\n` +
    `  $ small ${command.name()} -l src/handlers/**/*.ts    Build application with default cdk stack only supplying handlers location.`);
command.version('0.1.0');
command.showHelpAfterError('(add --help for additional information)');
command.addOption(new commander_1.Option('-n, --name <name>', 'Application name.'));
command.addOption(new commander_1.Option('-a, --cdk-app <path>', 'CDK app file. This option cannot be used with --template').default(false, `"app.[ts|js]"`));
command.addOption(new commander_1.Option('-H, --handlers <paths...>', 'Filenames or patterns to locate handlers. These filenames are resolved relative to the directory containing the small.config file. This option cannot be used with --template'));
command.addOption(new commander_1.Option('-t, --template <paths>', 'AWS SAM template file. This option cannot be used with --cdk-app or --handlers')
    .default(false, `"template.[yaml|yml|json]"`)
    .conflicts(['cdkApp', 'handlers']));
command.addOption(new commander_1.Option('-s, --sam-output <dir>', 'Directory to store build SAM artifacts. Note: This directory will be removed before starting a build.').default(application_builder_1.defaultBuildOpts.samOutput));
command.addOption(new commander_1.Option('-c, --cdk-output <dir>', 'Directory to store CDK synth artifacts. Note: This directory will be removed before starting a build.').default(application_builder_1.defaultBuildOpts.cdkOutput));
command.addOption(new commander_1.Option('-b, --builder <builder>', 'Specify which builder to use')
    .choices(Object.values(application_builder_1.SupportedBuilders))
    .default(application_builder_1.SupportedBuilders.ESBUILD));
command.addOption(new commander_1.Option('-p, --parallel', 'Enable parallel build of handlers'));
command.addOption(new commander_1.Option('-v, --verbose', 'Turn on debug logging to print debug message'));
command.parse(process.argv);
// Initializing logger
const logger = winston_1.default.createLogger({
    level: 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.printf(({ message, level }) => `[${level}] ${message}`)),
    transports: [
        new winston_1.default.transports.Stream({
            stream: process.stdout,
            level: 'debug',
        }),
    ],
});
// Prepare Action options
const opts = command.opts();
if (!opts.cdkApp && !opts.template) {
    logger.debug(`Neither option -a, --cdk-app or -t, --template is set, will try to find application project file`);
    const appProjectFile = appProjectFileSequence
        .map((file) => path_1.default.resolve(process.cwd() + '/' + file))
        .find((file) => {
        if ((0, fs_1.existsSync)(file)) {
            logger.debug(`Found application project file ${path_1.default.relative(process.cwd(), file)}`);
            return file;
        }
    });
    if (!appProjectFile)
        throw new Error('No application project found.');
    const fileType = appProjectFile.substring(appProjectFile.lastIndexOf('.'));
    if (0 <= ['.ts', '.js'].indexOf(fileType)) {
        logger.debug(`Adding option --cdk-app ${appProjectFile}`);
        opts.cdkApp = appProjectFile;
    }
    else if (0 <= ['.yaml', '.yml', '.json'].indexOf(fileType)) {
        logger.debug(`Adding option --template ${appProjectFile}`);
        opts.template = appProjectFile;
    }
}
// Execute action
const action = new application_builder_1.default(logger, opts);
action
    .build()
    .then(() => {
    logger.info(`Execution time: ${timer.getElapsed()}\n`);
})
    .catch((err) => {
    const help = command.createHelp();
    let msg = help.formatHelp(command, help);
    command.error(msg + '\nError: ' + (isError(err) ? err.message : `${err}`));
});
function isError(val) {
    return undefined !== val.message;
}
