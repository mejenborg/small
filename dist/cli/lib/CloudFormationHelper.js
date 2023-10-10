"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = exports.load = void 0;
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importStar(require("js-yaml"));
var CF_SCHEMA = js_yaml_1.DEFAULT_SCHEMA.extend([
    new js_yaml_1.default.Type('!Ref', {
        kind: 'scalar',
        construct: function (data) {
            return { Ref: data };
        },
    }),
    new js_yaml_1.default.Type('!Equals', {
        kind: 'sequence',
        construct: function (data) {
            return { 'Fn::Equals': data };
        },
    }),
    new js_yaml_1.default.Type('!Not', {
        kind: 'sequence',
        construct: function (data) {
            return { 'Fn::Not': data };
        },
    }),
    new js_yaml_1.default.Type('!Sub', {
        kind: 'scalar',
        construct: function (data) {
            return { 'Fn::Sub': data };
        },
    }),
    new js_yaml_1.default.Type('!If', {
        kind: 'sequence',
        construct: function (data) {
            return { 'Fn::If': data };
        },
    }),
    new js_yaml_1.default.Type('!Or', {
        kind: 'sequence',
        construct: function (data) {
            return { 'Fn::Or': data };
        },
    }),
    new js_yaml_1.default.Type('!ImportValue', {
        kind: 'scalar',
        construct: function (data) {
            return { 'Fn::ImportValue': data };
        },
    }),
    new js_yaml_1.default.Type('!Join', {
        kind: 'sequence',
        construct: function (data) {
            return { 'Fn::Join': data };
        },
    }),
    new js_yaml_1.default.Type('!Select', {
        kind: 'sequence',
        construct: function (data) {
            return { 'Fn::Select': data };
        },
    }),
    new js_yaml_1.default.Type('!FindInMap', {
        kind: 'sequence',
        construct: function (data) {
            return { 'Fn::FindInMap': data };
        },
    }),
    new js_yaml_1.default.Type('!GetAtt', {
        kind: 'scalar',
        construct: function (data) {
            return { 'Fn::GetAtt': data };
        },
    }),
    new js_yaml_1.default.Type('!GetAZs', {
        kind: 'mapping',
        construct: function (data) {
            return { 'Fn::GetAZs': data };
        },
    }),
    new js_yaml_1.default.Type('!Base64', {
        kind: 'mapping',
        construct: function (data) {
            return { 'Fn::Base64': data };
        },
    }),
]);
function load(file) {
    if (!fs_1.default.existsSync(file))
        throw new Error(`File ${file} could not be found`);
    const ext = file.substring(file.lastIndexOf('.'));
    switch (ext) {
        case '.yaml':
        case '.yml':
            return js_yaml_1.default.load(fs_1.default.readFileSync(file, 'utf8'), { schema: CF_SCHEMA });
        case '.json':
            return JSON.parse(fs_1.default.readFileSync(file, 'utf-8'));
        default:
            throw new Error(`Unknown file extension ${ext}`);
    }
}
exports.load = load;
function write(file, contents) {
    const ext = file.substring(file.lastIndexOf('.'));
    switch (ext) {
        case '.yaml':
        case '.yml':
            process.stdout.write(`Writing template to ${file}\n`);
            fs_1.default.writeFileSync(fs_1.default.openSync(file, 'w'), js_yaml_1.default.dump(contents, { schema: CF_SCHEMA, indent: 4 }));
            break;
        case '.json':
            process.stdout.write(`Writing template to ${file}\n`);
            fs_1.default.writeFileSync(fs_1.default.openSync(file, 'w'), JSON.stringify(contents, null, 4));
            break;
        default:
            throw new Error(`Unknown file extension ${ext}`);
    }
}
exports.write = write;
