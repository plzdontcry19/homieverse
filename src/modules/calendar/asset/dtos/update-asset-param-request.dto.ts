import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class UpdateAssetParamRequestDTO {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number, description: 'asset_id' })
  id: number
}
