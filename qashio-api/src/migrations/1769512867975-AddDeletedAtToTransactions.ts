import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToTransactions1769512867975
  implements MigrationInterface
{
  name = 'AddDeletedAtToTransactions1769512867975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "deleted_at" TIMESTAMP`,
    );
  }
}
