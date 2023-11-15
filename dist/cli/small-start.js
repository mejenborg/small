"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const cmd_1 = require("./_lib/cmd");
const config_1 = require("./_lib/config");
const program = new commander_1.Command();
program.name('start');
program.description('');
program.version('0.1.0');
program.addOption(new commander_1.Option('-v, --verbose'));
program.addOption(new commander_1.Option('-s, --sam-tpl <path>', 'The AWS SAM template'));
program.addOption(new commander_1.Option('-d, --db-tpl <path>', 'The database Docker template'));
program.parse(process.argv);
const args = program.opts();
const main = async () => {
    const config = await (0, config_1.loadConfig)();
    const samTpl = args.samTpl ?? config.samOutput ? `${config.samOutput}/template.yaml` : '.aws-sam/template.yaml';
    const dbTpl = args.dbTpl ?? (config.dockerOutput ? `${config.dockerOutput}/` : './') + 'rds-docker.yaml';
    await new cmd_1.DockerNetworkCreateBridgeCmd({ verbose: args.verbose ?? false }).exec(['samlocal']);
    await new cmd_1.DockerComposeCmd({ verbose: args.verbose ?? false }).exec(['-f', dbTpl, 'up', '--build', '--detach']);
    await new cmd_1.SamLocalStartApiCmd({ verbose: args.verbose ?? false }).exec([
        '--template',
        samTpl,
        '--port',
        '3000',
        '--container-host-interface',
        '0.0.0.0',
        '--docker-network',
        'samlocal',
    ]);
};
main();
