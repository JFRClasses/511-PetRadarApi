import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOwnerNameColumn1787353616603 implements MigrationInterface {
    name = 'AddOwnerNameColumn1787353616603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LOST_PET" ADD "ownerName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LOST_PET" DROP COLUMN "ownerName"`);
    }

}
