import { Command } from 'commander';

const program = new Command();

program.name('small').description('').version('0.1.0');

program.command('build', 'Build the serverless application.');
program.command('start', 'Start the serverless application.');

program.parse(process.argv);
