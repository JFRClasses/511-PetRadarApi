import { envs } from "src/config/envs";
import { PendingEmail } from "src/email/entities/pending-email.entity";
import { LostPet } from "src/lost-pets/entities/lost-pet.entity";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions : DataSourceOptions = {
    host: envs.DB_HOST,
    type: 'postgres',
    database: envs.DB_NAME,
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    port: envs.DB_PORT,
    entities: [LostPet,PendingEmail],
    synchronize: false,
    migrations: ['dist/db/migrations/[0-9]*-*.js']
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

