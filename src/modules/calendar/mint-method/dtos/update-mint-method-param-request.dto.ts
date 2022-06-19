import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class UpdateMintMethodParamRequestDTO {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number, description: 'mint_method_id', example: 1 })
  id: number
}
