import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class UpdateVotingParamRequestDTO {
  @Type(() => Number)
  @IsNumber()
  id: number
}
