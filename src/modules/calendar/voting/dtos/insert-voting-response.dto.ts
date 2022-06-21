import { Expose } from 'class-transformer'

export class InsertVotingResponseDTO {
  @Expose()
  voting_id: number
}
