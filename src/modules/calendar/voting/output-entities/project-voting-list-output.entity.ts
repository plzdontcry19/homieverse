import { Expose } from 'class-transformer'

export class ProjectVotingListOutputEntity {
  @Expose()
  voting_list: string[]
}
