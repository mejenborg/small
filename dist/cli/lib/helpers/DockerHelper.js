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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDockerFromCfn = void 0;
const fs = __importStar(require("fs"));
const js_yaml_1 = __importStar(require("js-yaml"));
function createDockerFromCfn(path, output) {
    const cfn = JSON.parse(fs.readFileSync(path, 'utf8'));
    const dockerFile = {
        version: '3.8',
        services: {},
        networks: {
            samlocal: {
                name: 'samlocal',
                driver: 'bridge',
                external: true,
            },
        },
    };
    if (!cfn.Resources)
        throw new Error('Malformed CloudFormation file');
    for (const [name, resource] of Object.entries(cfn.Resources)) {
        if ('AWS::RDS::DBInstance' !== resource?.Type)
            continue;
        dockerFile.services.db = {
            image: resource.Properties.Engine + ':' + resource.Properties.EngineVersion,
            container_name: resource.Properties.Engine,
            restart: 'always',
            environment: {
                MARIADB_ROOT_PASSWORD: '123',
                MARIADB_DATABASE: resource.Properties.DBName,
                MARIADB_USER: resource.Properties.MasterUsername,
                MARIADB_PASSWORD: '123',
            },
            volumes: [`../dbdata:/var/lib/${resource.Properties.Engine}`],
            networks: ['samlocal'],
            ports: [resource.Properties.Port + ':' + resource.Properties.Port],
        };
    }
    if (!fs.existsSync(output))
        fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(`${output}/rds-docker.yaml`, js_yaml_1.default.dump(dockerFile, { schema: js_yaml_1.DEFAULT_SCHEMA, indent: 4 }), {
        flag: 'w',
    });
}
exports.createDockerFromCfn = createDockerFromCfn;
