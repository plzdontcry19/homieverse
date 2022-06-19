
import { plainToClass } from 'class-transformer'
import { TestingEntity } from 'src/entities/testing.entity'
import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { EntityRepository, Repository } from 'typeorm'
import { TestingOutputOutputEntity } from '../output-entities/testing-output.entity'

interface ICreateTestingParam {
  key: string
  value: string
}

interface IUpdateTestingParam {
  id: number
  key: string
  value: string
}

interface IDeleteTestingParam {
  id: number
}

@EntityRepository(TestingEntity)
export class TestingRepository extends Repository<TestingEntity>{

  public async findManyTesting() {
    const result = await this.find({})
    return plainToClass(TestingOutputOutputEntity, result, { excludeExtraneousValues: true })
  }

  public async createTesting(params: ICreateTestingParam) {
    const { key, value } = params

    const entity = plainToClass(TestingEntity, {
      key,
      value,
    })

    const result = await this.save(entity)

    return plainToClass(TestingOutputOutputEntity, result, { excludeExtraneousValues: true })
  }

  public async editTesting(params: IUpdateTestingParam) {
    const { id, key, value } = params

    await this.update(
      id,
      plainToClass(TestingEntity, {
        key,
        value,
      }),
    )
  }

  public async deleteTesting(params: IDeleteTestingParam) {
    const { id } = params

    await this.delete(id)
  }
}
