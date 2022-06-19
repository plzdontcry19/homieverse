import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateAssetRequestDTO {
  @IsString()
  @ApiProperty({ type: String, description: 'For use in <img> elements, see more https://www.base64-image.de/' })
  asset_url: string
}
