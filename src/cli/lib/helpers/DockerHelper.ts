import * as fs from 'fs';
import yaml, { DEFAULT_SCHEMA } from 'js-yaml';

type DockerFile = {
    version: string;
    services: { [name: string]: DockerNode };
    networks: { [name: string]: DockerNode };
};

type DockerNode = {
    [name: string]: boolean | string | string[] | number | DockerNode;
};

type CfnTemplate = {
    Transform: string;
    Resources: CfnResource[];
};

type CfnResource = {
    Type: string;
    Properties: CfnResourceProps;
};

type CfnResourceProps = {
    [name: string]: boolean | string | string[] | number | CfnResourceProps;
};

export function createDockerFromCfn(path: string, output: string) {
    const cfn: CfnTemplate = JSON.parse(fs.readFileSync(path, 'utf8'));

    const dockerFile: DockerFile = {
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

    if (!cfn.Resources) throw new Error('Malformed CloudFormation file');

    for (const [name, resource] of Object.entries(cfn.Resources)) {
        if ('AWS::RDS::DBInstance' !== resource?.Type) continue;

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

    if (!fs.existsSync(output)) fs.mkdirSync(output, { recursive: true });

    fs.writeFileSync(`${output}/rds-docker.yaml`, yaml.dump(dockerFile, { schema: DEFAULT_SCHEMA, indent: 4 }), {
        flag: 'w',
    });
}
