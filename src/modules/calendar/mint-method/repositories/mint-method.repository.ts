import { plainToClass } from 'class-transformer'
import { MintMethodEntity } from 'src/entities/mint-method.entity'
import { EntityRepository, Repository } from 'typeorm'

interface ICreateParam {
  name: number
  description: string
}

@EntityRepository(MintMethodEntity)
export class MintMethodRepository extends Repository<MintMethodEntity> {
  public async createHasAsset(params: ICreateParam) {
    const { name, description } = params

    const entity = plainToClass(MintMethodEntity, {
      name,
      description,
    })

    return await this.save(entity)
  }
}
