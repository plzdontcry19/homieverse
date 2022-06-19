import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { MintTypeEnum } from 'src/enums/mint-type.enum'
import { Helpers } from 'src/helper'

export class InsertProjectRequestDTO {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  asset_id_list: number[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MintInfoDTO)
  mint_info_list: MintInfoDTO[]
}

export class MintInfoDTO {
  @IsEnum(MintTypeEnum)
  type: MintTypeEnum

  @IsOptional()
  @IsString()
  description: string

  @IsNumber()
  mint_method_id: number

  @IsNumber()
  @IsPositive()
  price: number

  @IsString()
  unit: string

  @Transform((value) => Helpers.convertToDate(value.value))
  @IsDate()
  start_date: Date

  @IsOptional()
  @Transform((value) => Helpers.convertToDate(value.value))
  @IsDate()
  end_date: Date
}
