import { Command } from 'commander';

const program = new Command();

program.name('small').description('').version('0.1.0');

program.command('build', 'Build application');

program.parse(process.argv);

const main = async () => {};

main();
