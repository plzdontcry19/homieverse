import { VotingStatusEnum } from 'src/enums/voting-status.enum'

export interface ICrateVotingInput {
  projectId: number
  status: VotingStatusEnum
  description: string
}
