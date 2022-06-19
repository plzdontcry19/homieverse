import { IsString } from 'class-validator'

export class InsertAssetRequestDTO {
  @IsString()
  asset_url: string
}
