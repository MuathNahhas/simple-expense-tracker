import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransactionIndexes1769610518007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_transaction_date
      ON transactions(date DESC)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_transaction_type
      ON transactions(type)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_transaction_notes_trgm
      ON transactions USING GIN (notes gin_trgm_ops)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_category_name_trgm
      ON categories USING GIN (name gin_trgm_ops)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_transaction_amount
      ON transactions(amount)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transaction_amount`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_category_name_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transaction_notes_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transaction_type`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transaction_date`);
  }
}
