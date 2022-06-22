import { VotingStatusEnum } from 'src/enums/voting-status.enum'

export interface ICrateVotingInput {
  ipAddress?: string
  projectId: number
  status: VotingStatusEnum
  description: string
  userId?: number
}

export interface IUpdateVotingInput {
  ipAddress?: string
  projectId: number
  status: VotingStatusEnum
  description: string
  userId?: number
}
