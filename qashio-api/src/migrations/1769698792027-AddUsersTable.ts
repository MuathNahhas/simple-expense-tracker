import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1769698792027 implements MigrationInterface {
    name = 'AddUsersTable1769698792027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_transaction_categoryId"`);
        await queryRunner.query(`DROP INDEX "public"."idx_transaction_category_gist"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "status" SET DEFAULT 'completed'`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`CREATE INDEX "idx_transaction_category_gist" ON "categories" USING GiST ("name") `);
        await queryRunner.query(`CREATE INDEX "idx_transaction_categoryId" ON "transactions" ("categoryId") `);
    }

}
