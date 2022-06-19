import { Injectable } from '@nestjs/common'
import { TestingRepository } from '../repositories/testing.repository'
import { v4 as uuid } from 'uuid'
import { EntityManager, getConnection, getManager } from 'typeorm'
import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { DbIsolationLevelEnum } from 'src/enums/db-isolation-level.enum'
import { TransactionWrapper } from 'src/entity-managers/trans.wrapper'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(TestingRepository, PostgresConnectionEnum.WEB)
        private testingRepo: TestingRepository) { }

    public async findManyTesting() {
        return await this.testingRepo.findManyTesting()
    }

    public async createTesting() {
        return await this.testingRepo.createTesting({
            key: uuid(),
            value: uuid(),
        })
    }

    public async editTesting(id: number) {
        await this.testingRepo.editTesting({
            id,
            key: uuid(),
            value: uuid(),
        })
    }

    public async deleteTesting(id: number) {
        await this.testingRepo.deleteTesting({ id })

    }

    public async trx() {
        await getManager(PostgresConnectionEnum.WEB).transaction(
            DbIsolationLevelEnum.SERIALIZABLE,

            async (tx: EntityManager): Promise<any> => {
                const task = async () => {
                    await tx.getCustomRepository(TestingRepository).createTesting({
                        key: '1234',
                        value: '1234'
                    })
                    throw new Error('helo')
                }

                return await TransactionWrapper.runInTransaction(
                    getConnection(PostgresConnectionEnum.WEB).createQueryRunner(),
                    task,
                )
            },
        )
    }

}
