import { plainToClass } from 'class-transformer'
import { ProjectHasAssetEntity } from 'src/entities/project-has-asset.entity'
import { EntityRepository, Repository } from 'typeorm'

interface ICreateParam {
  projectId: number
  assetId: number
}

@EntityRepository(ProjectHasAssetEntity)
export class ProjectHasAssetRepository extends Repository<ProjectHasAssetEntity> {
  public async createHasAsset(params: ICreateParam) {
    const { projectId: project_id, assetId: asset_id } = params

    const entity = plainToClass(ProjectHasAssetEntity, {
      project_id,
      asset_id,
    })

    return await this.save(entity)
  }
}
