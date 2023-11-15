import { existsSync, mkdirSync, rmSync } from 'fs';
import winston from 'winston';

export default abstract class Builder {
    logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.logger = logger;
    }

    abstract build(template: string, outputDir: string): Promise<void>;

    prepareOutputDir(outputDir: string) {
        this.logger.info(`Preparing output directory ${outputDir}`);

        if (existsSync(outputDir)) {
            this.logger.debug(`Remove ${outputDir}`);
            rmSync(outputDir, { recursive: true, force: true });
        }

        this.logger.debug(`Create ${outputDir}`);
        mkdirSync(outputDir, { recursive: true });
    }
}
