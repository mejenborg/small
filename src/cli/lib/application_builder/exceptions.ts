export class MissingOptionError extends Error {}

export class UnsupportedApplicationBuilder extends Error {
    constructor(type: string) {
        super(`Unsupported application builder "${type}"`);
    }
}

export class IncompatibleOptionsCombinationError extends Error {
    constructor(name1: string, name2: string) {
        super(`${name1} cannot be used with ${name2}`);
    }
}
