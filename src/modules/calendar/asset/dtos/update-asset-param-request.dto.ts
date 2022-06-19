import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class UpdateAssetParamRequestDTO {
  @Type(() => Number)
  @IsNumber()
  id: number
}
