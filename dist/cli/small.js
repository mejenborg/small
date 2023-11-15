#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program.name('small').description('').version('0.1.0');
program.command('build', 'Build the serverless application.');
program.command('start', 'Start the serverless application.');
program.parse(process.argv);
