import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { MintTypeEnum } from 'src/enums/mint-type.enum'
import { Helpers } from 'src/helper'

export class MintInfoDTO {
  @IsEnum(MintTypeEnum)
  @ApiProperty({
    type: String,
    description: `public or private, private mean allow list mint`,
    example: MintTypeEnum.PRIVATE,
  })
  type: MintTypeEnum

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: 'mint infomation', required: false })
  description: string

  @IsNumber()
  @ApiProperty({ type: Number, description: 'mint method id, must create first', example: 1 })
  mint_method_id: number

  @IsNumber()
  @Min(0)
  @ApiProperty({ type: Number, description: 'mint price, can be zero, mean free mint', example: 0.2 })
  price: number

  @IsString()
  @ApiProperty({ type: Number, description: 'ex. ETH, BTC', example: 'ETC' })
  unit: string

  @Transform((value) => Helpers.convertToDate(value.value))
  @IsDate()
  @ApiProperty({ type: Number, description: 'date unix time,see https://www.unixtimestamp.com/', example: 1666602645 })
  start_date: Date

  @IsOptional()
  @Transform((value) => Helpers.convertToDate(value.value))
  @IsDate()
  @ApiProperty({
    type: Number,
    description: 'date unix time,see https://www.unixtimestamp.com/',
    example: 1666948245,
    required: false,
  })
  end_date: Date
}

export class InsertProjectRequestDTO {
  @IsString()
  @ApiProperty({ type: String, description: 'project name' })
  name: string

  @IsString()
  @ApiProperty({ type: String, description: 'project description' })
  description: string

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @ApiProperty({ type: Number, isArray: true, description: 'asset id' })
  asset_id_list: number[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MintInfoDTO)
  @ArrayMinSize(1)
  @ApiProperty({ type: () => MintInfoDTO })
  mint_info_list: MintInfoDTO[]
}
