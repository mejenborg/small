import { spawn } from 'node:child_process';
import winston from 'winston';
import Timer from './Timer';

export class Cmd {
    private command: string;
    logger: winston.Logger;

    constructor(command: string, logger: winston.Logger) {
        this.command = command;
        this.logger = logger;
    }

    async exec(args: ReadonlyArray<string>, env?: NodeJS.ProcessEnv): Promise<void> {
        return new Promise((resolve, reject) => {
            this.logger.debug(`Execute: ${this.command} ${args.join(' ')}\n`);
            if (env && 0 < Object.keys(env).length)
                this.logger.debug(`Setting environment variables: ${JSON.stringify(env)}`);

            const timer = new Timer();
            const cmd = spawn(this.command, args, {
                shell: true,
                cwd: process.cwd(),
                env: { ...process.env, ...env },
            });

            cmd.stdout.on('data', (chunk: unknown) => {
                this.onStdout(chunk);
            });

            cmd.stderr.on('data', (chunk: unknown) => {
                this.onStderr(chunk);
            });

            process.on('SIGINT', function () {
                cmd.kill('SIGINT');
            });

            cmd.on('exit', (code) => {
                this.logger.debug(`${this.command} ${args.join(' ')} executed in ${timer.getElapsed()}`);
                !code || code !== 0 ? resolve() : reject(code);
            });
        });
    }

    onStdout(chunk: unknown) {
        const str = chunk?.toString()!.trim();
        if (str) this.logger.info(`${this.command}: ${str}`);
    }

    onStderr(chunk: unknown) {
        const str = chunk?.toString()!.trim();
        if (str) this.logger.error(`${this.command}: ${str}`);
    }
}
