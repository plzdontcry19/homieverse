import { plainToClass } from 'class-transformer'
import { AssetEntity } from 'src/entities/asset.entity'
import { EntityRepository, Repository } from 'typeorm'

interface ICreateAssetParam {
  name: string
  data: string
  mimeType: string
}

interface IUpdateAssetParam {
  id: number
  data: string
  mimeType: string
}

@EntityRepository(AssetEntity)
export class AssetRepository extends Repository<AssetEntity> {
  public async createAsset(params: ICreateAssetParam) {
    const { name, data, mimeType: mime_type } = params

    const entity = plainToClass(AssetEntity, {
      name,
      data,
      mime_type,
    })

    return await this.save(entity)
  }

  public async updateAsset(params: IUpdateAssetParam) {
    const { id, data, mimeType: mime_type } = params

    const entity = plainToClass(AssetEntity, {
      data,
      mime_type,
    })

    await this.update(id, entity)
  }
}
