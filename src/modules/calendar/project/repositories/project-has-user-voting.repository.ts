import { plainToClass } from 'class-transformer'
import { EntityRepository, Repository } from 'typeorm'

import { ProjectHasUserVotingEntity } from 'src/entities/project-has-user-voting.entity'

interface ICreateHasUserVotingParam {
  projectId: number
  votingId: number
  userId?: number
  ipAddress: string
}

@EntityRepository(ProjectHasUserVotingEntity)
export class ProjectHasUserVotingRepository extends Repository<ProjectHasUserVotingEntity> {
  public async createHasUserVoting(params: ICreateHasUserVotingParam) {
    const { projectId: project_id, votingId: voting_id, userId = null, ipAddress: ip_address } = params

    const entity = plainToClass(ProjectHasUserVotingEntity, {
      project_id,
      voting_id,
      ip_address,
      userId,
    })

    return await this.save(entity)
  }
}
