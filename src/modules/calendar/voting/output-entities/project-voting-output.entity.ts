import { Expose } from 'class-transformer'
import { VotingStatusEnum } from 'src/enums/voting-status.enum'

export class ProjectVotingOutputEntity {
  @Expose()
  voting_id: number

  @Expose()
  voting_status: VotingStatusEnum

  @Expose()
  voting_description: string
}
