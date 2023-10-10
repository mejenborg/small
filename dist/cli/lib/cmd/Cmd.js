"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cmd = void 0;
const node_child_process_1 = require("node:child_process");
class Cmd {
    constructor(command, opts) {
        this.verbose = false;
        this.command = command;
        if (opts?.verbose)
            this.verbose = opts.verbose;
    }
    async exec(args, opts) {
        const env = opts?.env ?? {};
        return new Promise((resolve, reject) => {
            if (this.verbose) {
                process.stdout.write(`Execute: ${this.command} ${args.join(' ')}\n`);
                process.stdout.write(`  - cwd: ${process.cwd()}\n`);
                if (0 != Object.keys(env).length) {
                    process.stdout.write(`  - env:\n    ` +
                        Object.keys(env)
                            .map((item) => item + '=' + env[item])
                            .join('\n    ') +
                        '\n');
                }
            }
            const cmd = (0, node_child_process_1.spawn)(this.command, args, {
                shell: true,
                cwd: process.cwd(),
                env: { ...process.env, ...env },
            });
            if (this.verbose) {
                cmd.stdout.on('data', (chunk) => {
                    this.onStdout(this, chunk);
                });
            }
            cmd.stderr.on('data', (chunk) => {
                this.onStderr(this, chunk);
            });
            process.on('SIGINT', function () {
                cmd.kill('SIGINT');
            });
            cmd.on('exit', (code) => {
                !code || code !== 0 ? resolve() : reject(code);
            });
        });
    }
    onStdout(context, chunk) {
        const str = chunk?.toString().trim();
        if (str)
            process.stdout.write(context.command + ': ' + str + '\n');
    }
    onStderr(context, chunk) {
        const str = chunk?.toString().trim();
        if (str)
            process.stderr.write(context.command + ': ' + str + '\n');
    }
}
exports.Cmd = Cmd;
