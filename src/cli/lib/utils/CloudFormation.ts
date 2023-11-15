import fs from 'fs';
import yaml, { DEFAULT_SCHEMA } from 'js-yaml';
import winston from 'winston';

var CF_SCHEMA = DEFAULT_SCHEMA.extend([
    new yaml.Type('!Ref', {
        kind: 'scalar',
        construct: function (data: unknown) {
            return { Ref: data };
        },
    }),
    new yaml.Type('!Equals', {
        kind: 'sequence',
        construct: function (data: unknown) {
            return { 'Fn::Equals': data };
        },
    }),
    new yaml.Type('!Not', {
        kind: 'sequence',
        construct: function (data: unknown) {
            return { 'Fn::Not': data };
        },
    }),
    new yaml.Type('!Sub', {
        kind: 'scalar',
        construct: function (data: unknown) {
            return { 'Fn::Sub': data };
        },
    }),
    new yaml.Type('!If', {
        kind: 'sequence',
        construct: function (data: unknown) {
            return { 'Fn::If': data };
        },
    }),
    new yaml.Type('!Or', {
        kind: 'sequence',
        construct: function (data: unknown) {
            return { 'Fn::Or': data };
        },
    }),
    new yaml.Type('!ImportValue', {
        kind: 'scalar',
        construct: function (data: unknown) {
            return { 'Fn::ImportValue': data };
        },
    }),
    new yaml.Type('!Join', {
        kind: 'sequence',
        construct: function (data: unknown) {
            return { 'Fn::Join': data };
        },
    }),
    new yaml.Type('!Select', {
        kind: 'sequence',
        construct: function (data: unknown) {
            return { 'Fn::Select': data };
        },
    }),
    new yaml.Type('!FindInMap', {
        kind: 'sequence',
        construct: function (data: unknown) {
            return { 'Fn::FindInMap': data };
        },
    }),
    new yaml.Type('!GetAtt', {
        kind: 'scalar',
        construct: function (data: unknown) {
            return { 'Fn::GetAtt': data };
        },
    }),
    new yaml.Type('!GetAZs', {
        kind: 'mapping',
        construct: function (data: unknown) {
            return { 'Fn::GetAZs': data };
        },
    }),
    new yaml.Type('!Base64', {
        kind: 'mapping',
        construct: function (data: unknown) {
            return { 'Fn::Base64': data };
        },
    }),
]);

export type CfnNode = {
    [key: string]: CfnNode | string | string[] | number | number[] | boolean;
};

export default class CloudFormation {
    logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.logger = logger;
    }

    load(file: string): CfnNode {
        if (!fs.existsSync(file)) throw new Error(`File ${file} could not be found`);

        this.logger.info(`Loading CloudFormation template ${file}`);

        const ext = file.substring(file.lastIndexOf('.'));

        if (['.yaml', '.yml'].includes(ext)) {
            this.logger.debug(`Parse CloudFormation template as YAML`);
            return yaml.load(fs.readFileSync(file, 'utf8'), { schema: CF_SCHEMA }) as CfnNode;
        } else if ('.json' == ext) {
            this.logger.debug('Parse CloudFormation template as JSON');
            return JSON.parse(fs.readFileSync(file, 'utf-8')) as CfnNode;
        } else {
            throw new Error(`Unknown file extension ${ext}`);
        }
    }

    write(file: string, contents: CfnNode): void {
        this.logger.info(`Writing template to ${file}`);

        let content: unknown;

        const ext = file.substring(file.lastIndexOf('.'));

        if (['.yaml', '.yml'].includes(ext)) {
            this.logger.debug(`Export CloudFormation template as Yaml`);
            content = yaml.dump(contents, { schema: CF_SCHEMA, indent: 4 });
        } else if ('.json' == ext) {
            this.logger.debug(`Export CloudFormation template as JSON`);
            content = JSON.stringify(contents, null, 4);
        } else {
            throw new Error(`Unknown file extension ${ext}`);
        }

        fs.writeFileSync(fs.openSync(file, 'w'), <string>content);
    }
}
