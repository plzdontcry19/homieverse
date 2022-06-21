import { plainToClass } from 'class-transformer'
import { ProjectHasUserVotingEntity } from 'src/entities/project-has-user-voting.entity'
import { EntityRepository, Repository } from 'typeorm'

interface ICreateHasUserVotingParam {
  projectId: number
  votingId: number
  userId?: number
}

@EntityRepository(ProjectHasUserVotingEntity)
export class ProjectHasUserVotingRepository extends Repository<ProjectHasUserVotingEntity> {
  public async createHasUserVoting(params: ICreateHasUserVotingParam) {
    const { projectId: project_id, votingId: voting_id, userId = null } = params

    const entity = plainToClass(ProjectHasUserVotingEntity, {
      project_id,
      voting_id,
    })

    return await this.save(entity)
  }
}
