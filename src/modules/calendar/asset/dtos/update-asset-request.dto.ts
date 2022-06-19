import { IsString } from 'class-validator'

export class UpdateAssetRequestDTO {
  @IsString()
  asset_url: string
}
