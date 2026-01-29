import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusColumn1769669646778 implements MigrationInterface {
  name = 'AddStatusColumn1769669646778';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."idx_transaction_notes_trgm"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."idx_category_name_trgm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "status" character varying NOT NULL DEFAULT 'active'`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_transaction_status" ON "transactions" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transaction_categoryId" ON "transactions" ("categoryId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transaction_notes_gist" ON "transactions" USING GIST ("notes" gist_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transaction_category_gist" ON "categories" USING GIST ("name" gist_trgm_ops)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_transaction_status"`);
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE INDEX "idx_category_name_trgm" ON "categories" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_transaction_notes_trgm" ON "transactions" ("notes") `,
    );
  }
}
