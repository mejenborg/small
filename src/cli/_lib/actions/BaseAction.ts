import winston from 'winston';

export interface BaseExecOpts {
    verbose?: boolean;
}

export default abstract class BaseAction {
    logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.logger = logger;
    }

    abstract exec(opts: BaseExecOpts): Promise<void>;
}
