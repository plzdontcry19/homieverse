import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class InsertMintMethodRequestDTO {
  @IsString()
  @ApiProperty({ type: String, description: 'mint method name', example: 'something' })
  name: string

  @IsString()
  @ApiProperty({ type: String, description: 'mint method description', example: 'something' })
  description: string
}
