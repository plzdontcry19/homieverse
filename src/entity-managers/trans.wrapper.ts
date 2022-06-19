import { QueryRunner } from 'typeorm'

export class TransactionWrapper {
  public static async runInTransaction(
    queryRunner: QueryRunner,
    task: () => Promise<void>,
    isThrow = true,
  ): Promise<void> {
    try {
      await queryRunner.startTransaction()
      await task()
      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
      if (isThrow) {
        throw err
      }
    } finally {
      await queryRunner.release()
    }
  }
}
