import winston from 'winston';
import { Cmd } from './Cmd';

export default class Cdk {
    logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.logger = logger;
    }

    public async synth(app: string, output: string) {
        let opts = ['synth'];

        opts.push('--output', output!);

        if ('.ts' === app.substring(app.lastIndexOf('.'))) {
            opts.push('--app', `"npx ts-node --prefer-ts-exts ${app}"`);
        } else {
            opts.push('--app', `"node ${app}"`);
        }

        opts.push('--quiet');

        const cmd = new Cmd('cdk', this.logger);
        await cmd.exec(opts, {});
    }
}
