import { plainToClass } from 'class-transformer'
import { MintInfoEntity } from 'src/entities/mint-info.entity'
import { MintTypeEnum } from 'src/enums/mint-type.enum'
import { EntityRepository, Repository } from 'typeorm'

interface ICreateMintInfoParam {
  type: MintTypeEnum
  description: string
  mintMethodId: number
  price: number
  unit: string
  startDate: Date
  endDate: Date
}

@EntityRepository(MintInfoEntity)
export class MintInfoRepository extends Repository<MintInfoEntity> {
  public async createMintInfo(params: ICreateMintInfoParam) {
    const {
      type,
      mintMethodId: mint_method_id,
      price,
      unit,
      startDate: start_date,
      endDate: end_date,
      description,
    } = params

    const entity = plainToClass(MintInfoEntity, {
      type,
      description,
      mint_method_id,
      price,
      unit,
      start_date,
      end_date,
    })

    return await this.save(entity)
  }
}
