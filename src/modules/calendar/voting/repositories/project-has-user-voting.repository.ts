import { ProjectHasUserVotingEntity } from 'src/entities/project-has-user-voting.entity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(ProjectHasUserVotingEntity)
export class ProjectHasUserVotingRepository extends Repository<ProjectHasUserVotingEntity> {}
