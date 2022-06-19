import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateMintMethodRequestDTO {
  @IsString()
  @ApiProperty({ type: String, description: 'mint method name', example: 'name' })
  name: string

  @IsString()
  @ApiProperty({ type: String, description: 'mint method description', example: 'name' })
  description: string
}
