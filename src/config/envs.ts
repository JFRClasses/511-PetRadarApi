import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
    MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
    MAILER_USER: env.get('MAILER_USER').required().asString(),
    MAILER_TOKEN: env.get('MAILER_TOKEN').required().asString(),
    MAPBOX_TOKEN: env.get('MAPBOX_TOKEN').required().asString(),
    DB_NAME: env.get('DB_NAME').required().asString(),
    DB_HOST: env.get('DB_HOST').required().asString(),
    DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
    DB_USER: env.get('DB_USER').required().asString(),
    DB_PORT: env.get('DB_PORT').required().asPortNumber(),
    REDIS_HOST: env.get('REDIS_HOST').required().asString(),
    REDIS_PORT: env.get('REDIS_PORT').required().asPortNumber(),
    AWS_BUCKET: env.get('AWS_BUCKET').required().asString(),
    AWS_REGION: env.get('AWS_REGION').required().asString()
};