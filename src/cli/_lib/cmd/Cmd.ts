import { spawn } from 'node:child_process';

export interface CmdOptions {
    verbose?: boolean;
}

export interface CmdExecOptions {
    env?: NodeJS.ProcessEnv;
}

export class Cmd {
    command: string;
    verbose: boolean = false;

    constructor(command: string, opts?: CmdOptions) {
        this.command = command;
        if (opts?.verbose) this.verbose = opts.verbose;
    }

    async exec(args: ReadonlyArray<string>, opts?: CmdExecOptions): Promise<void> {
        const env = opts?.env ?? {};

        return new Promise((resolve, reject) => {
            if (this.verbose) {
                process.stdout.write(`Execute: ${this.command} ${args.join(' ')}\n`);
                process.stdout.write(`  - cwd: ${process.cwd()}\n`);
                if (0 != Object.keys(env).length) {
                    process.stdout.write(
                        `  - env:\n    ` +
                            Object.keys(env)
                                .map((item) => item + '=' + env[item])
                                .join('\n    ') +
                            '\n',
                    );
                }
            }

            const cmd = spawn(this.command, args, {
                shell: true,
                cwd: process.cwd(),
                env: { ...process.env, ...env },
            });

            if (this.verbose) {
                cmd.stdout.on('data', (chunk: unknown) => {
                    this.onStdout(this, chunk);
                });
            }

            cmd.stderr.on('data', (chunk: unknown) => {
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

    onStdout(context: Cmd, chunk: unknown) {
        const str = chunk?.toString()!.trim();
        if (str) process.stdout.write(context.command + ': ' + str + '\n');
    }

    onStderr(context: Cmd, chunk: unknown) {
        const str = chunk?.toString()!.trim();
        if (str) process.stderr.write(context.command + ': ' + str + '\n');
    }
}
