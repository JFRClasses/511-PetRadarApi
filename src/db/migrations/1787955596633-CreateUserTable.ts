import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1787955596633 implements MigrationInterface {
    name = 'CreateUserTable1787955596633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "SYSTEM_USER" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isPetAlertEnabled" boolean NOT NULL, "location" geometry(Point,4326) NOT NULL, "radius" integer NOT NULL, CONSTRAINT "PK_3f5912604df1254054eac4f2b5e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "SYSTEM_USER"`);
    }

}
