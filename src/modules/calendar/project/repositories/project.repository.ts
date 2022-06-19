import { plainToClass } from 'class-transformer'
import { ProjectEntity } from 'src/entities/project.entity'
import { EntityRepository, Repository } from 'typeorm'
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
}
