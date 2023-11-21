import { Command, Option } from 'commander';
//import { DockerComposeCmd, DockerNetworkCreateBridgeCmd, SamLocalStartApiCmd } from './_lib/cmd';
//import { loadConfig } from './_lib/config';

const program = new Command();

program.name('start');
program.description('');
program.version('0.1.0');

program.addOption(new Option('-v, --verbose'));
program.addOption(new Option('-s, --sam-tpl <path>', 'The AWS SAM template'));
program.addOption(new Option('-d, --db-tpl <path>', 'The database Docker template'));

program.parse(process.argv);

const args = program.opts() as {
    verbose?: boolean;
    samTpl?: string;
    dbTpl?: string;
};

const main = async () => {
    // const config = await loadConfig();
    // const samTpl = args.samTpl ?? config.samOutput ? `${config.samOutput}/template.yaml` : '.aws-sam/template.yaml';
    // const dbTpl = args.dbTpl ?? (config.dockerOutput ? `${config.dockerOutput}/` : './') + 'rds-docker.yaml';
    // await new DockerNetworkCreateBridgeCmd({ verbose: args.verbose ?? false }).exec(['samlocal']);
    // await new DockerComposeCmd({ verbose: args.verbose ?? false }).exec(['-f', dbTpl, 'up', '--build', '--detach']);
    // await new SamLocalStartApiCmd({ verbose: args.verbose ?? false }).exec([
    //     '--template',
    //     samTpl,
    //     '--port',
    //     '3000',
    //     '--container-host-interface',
    //     '0.0.0.0',
    //     '--docker-network',
    //     'samlocal',
    // ]);
};

main();
