import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLostPets1787352255718 implements MigrationInterface {
    name = 'CreateLostPets1787352255718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "LOST_PET" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "phone" character varying NOT NULL, "race" character varying NOT NULL, "age" integer NOT NULL, "color" character varying NOT NULL, CONSTRAINT "PK_7fda532c785dfc07c9c2a814365" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "LOST_PET"`);
    }

}
