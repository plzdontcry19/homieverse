import { plainToClass } from 'class-transformer'
import { AssetEntity } from 'src/entities/asset.entity'
import { MintInfoEntity } from 'src/entities/mint-info.entity'
import { MintMethodEntity } from 'src/entities/mint-method.entity'
import { ProjectHasAssetEntity } from 'src/entities/project-has-asset.entity'
import { ProjectHasMintInfoEntity } from 'src/entities/project-has-mint-info.entity'
import { ProjectEntity } from 'src/entities/project.entity'
import { EntityRepository, Repository } from 'typeorm'
import { CustomProjectOutputEntity } from '../output-entities/custom-project-output.entity'
import { ProjectOutputEntity } from '../output-entities/project-output.entity'

interface ICreateProjectParam {
  name: string
  description: string
}

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  public async createProject(params: ICreateProjectParam) {
    const { name, description } = params

    const entity = plainToClass(ProjectEntity, {
      name,
      description,
    })

    const result = await this.save(entity)

    return plainToClass(ProjectOutputEntity, result, { excludeExtraneousValues: true })
  }

  public async findManyProject() {
    const query = this.createQueryBuilder('project')
      .select([
        'project.id as project_id',
        'project.name as project_name',
        'project.description as project_description',
        'mint_info.id as mint_info_id',
        'mint_info.type as mint_info_type',
        'mint_info.description as mint_info_description',
        'mint_info.price as price',
        'mint_info.unit as unit',
        'mint_info.start_date as start_date',
        'mint_info.end_date as end_date',
        'mint_info.description as mint_info_description',
        'mint_method.name as mint_method_name',
        'mint_method.description as mint_method_description',
        'mint_method.id as mint_method_Fid',
        'asset.id as asset_id',

        // 'array_agg(asset.id) as asset_id_list',
        // 'array_agg(mint_info) as asset_id_list'
      ])
      .leftJoin(ProjectHasAssetEntity, 'project_has_asset', 'project.id = project_has_asset.project_id')
      .leftJoin(AssetEntity, 'asset', 'project_has_asset.asset_id = asset.id')
      .leftJoin(ProjectHasMintInfoEntity, 'project_has_mint_info', 'project.id = project_has_mint_info.project_id')
      .leftJoin(MintInfoEntity, 'mint_info', 'project_has_mint_info.mint_info_id = mint_info.id')
      .leftJoin(MintMethodEntity, 'mint_method', 'mint_info.mint_method_id = mint_method.id')
    // .groupBy(`project.id,asset.id,mint_info.id,mint_method.id`)

    const result = await query.getRawMany()
    return plainToClass(CustomProjectOutputEntity, result, { excludeExtraneousValues: true })
  }
}
