import { plainToClass } from 'class-transformer'
import { ProjectHasUserVotingEntity } from 'src/entities/project-has-user-voting.entity'
import { VotingEntity } from 'src/entities/voting.entity'
import { VotingStatusEnum } from 'src/enums/voting-status.enum'
import { EntityRepository, Repository } from 'typeorm'
import { ProjectVotingListOutputEntity } from '../output-entities/project-voting-list-output.entity'
import { ProjectVotingOutputEntity } from '../output-entities/project-voting-output.entity'

interface ICreateVotingParamParam {
  status: VotingStatusEnum
  description: string
}
interface IFindProjectVotingListParam {
  projectId: number
}
interface IFindOneProjectVotingParam {
  projectId: number
  ipAddress: string
}

@EntityRepository(VotingEntity)
export class VotingRepository extends Repository<VotingEntity> {
  public async createVoting(params: ICreateVotingParamParam) {
    const { status, description } = params

    const entity = plainToClass(VotingEntity, {
      status,
      description,
    })

    return await this.save(entity)
  }

  public async findProjectVotingList(params: IFindProjectVotingListParam) {
    const { projectId } = params

    const query = this.createQueryBuilder('voting')
      .select(['array_agg(voting.status) as voting_list'])
      .innerJoin(ProjectHasUserVotingEntity, 'project_has_user_voting', 'voting.id = project_has_user_voting.voting_id')
      .where('project_has_user_voting.project_id = :project_id ', {
        project_id: projectId,
      })
      .groupBy('project_has_user_voting.project_id')

    const result = await query.getRawMany()
    return plainToClass(ProjectVotingListOutputEntity, result)
  }

  public async findOneProjectVoting(params: IFindOneProjectVotingParam) {
    const { projectId, ipAddress } = params

    const query = this.createQueryBuilder('voting')
      .select(['voting.id as voting_id', 'voting.status as voting_status', 'voting.description as voting_description'])
      .innerJoin(ProjectHasUserVotingEntity, 'project_has_user_voting', 'voting.id = project_has_user_voting.voting_id')
      .where('project_has_user_voting.project_id = :project_id ', {
        project_id: projectId,
      })
      .andWhere('project_has_user_voting.ip_address = :ip_address ', {
        ip_address: ipAddress,
      })

    const result = await query.getRawOne()
    return plainToClass(ProjectVotingOutputEntity, result)
  }
}
