import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { VotingStatusEnum } from 'src/enums/voting-status.enum'

export class InsertVotingRequestDTO {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'project id', example: '1' })
  project_id: number

  @IsEnum(VotingStatusEnum)
  @ApiProperty({ type: String, description: 'status', example: 'mint, not_mint and not_sure' })
  status: VotingStatusEnum

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: `mint's comment`, example: 'nice project!!!!', required: false })
  description: string
}
