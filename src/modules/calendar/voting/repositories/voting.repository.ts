import { plainToClass } from 'class-transformer'
import { VotingEntity } from 'src/entities/voting.entity'
import { VotingStatusEnum } from 'src/enums/voting-status.enum'
import { EntityRepository, Repository } from 'typeorm'

interface ICreateVotingParamParam {
  status: VotingStatusEnum
  description: string
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
}
