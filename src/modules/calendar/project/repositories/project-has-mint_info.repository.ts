import { plainToClass } from 'class-transformer'
import { ProjectHasMintInfoEntity } from 'src/entities/project-has-mint-info.entity'
import { EntityRepository, Repository } from 'typeorm'

interface ICreateParam {
  projectId: number
  mintInfoId: number
}

@EntityRepository(ProjectHasMintInfoEntity)
export class ProjectHasMintInfoRepository extends Repository<ProjectHasMintInfoEntity> {
  public async createHasMintInfo(params: ICreateParam) {
    const { projectId: project_id, mintInfoId: mint_info_id } = params

    const entity = plainToClass(ProjectHasMintInfoEntity, {
      project_id,
      mint_info_id,
    })

    return await this.save(entity)
  }
}
