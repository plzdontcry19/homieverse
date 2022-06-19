import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class FindAssetRequestDTO {
  @Type(() => Number)
  @IsNumber()
  id: number
}
