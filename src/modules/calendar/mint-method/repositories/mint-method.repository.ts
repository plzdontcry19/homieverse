import { plainToClass } from 'class-transformer'
import { MintMethodEntity } from 'src/entities/mint-method.entity'
import { EntityRepository, Repository } from 'typeorm'

interface ICreateMintMethodParam {
  name: string
  description: string
}
interface IUpdateMintMethodParam {
  id: number
  name: string
  description: string
}

@EntityRepository(MintMethodEntity)
export class MintMethodRepository extends Repository<MintMethodEntity> {
  public async createMintMethod(params: ICreateMintMethodParam) {
    const { name, description } = params

    const entity = plainToClass(MintMethodEntity, {
      name,
      description,
    })

    return await this.save(entity)
  }

  public async updateMintMethod(params: IUpdateMintMethodParam) {
    const { id, name, description } = params

    const entity = plainToClass(MintMethodEntity, {
      name,
      description,
    })

    await this.update(id, entity)
  }
}
