#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program.name('small').description('').version('0.1.0');
program.command('build', 'Build application');
program.command('start', 'Start application');
program.parse(process.argv);
const main = async () => { };
main();
