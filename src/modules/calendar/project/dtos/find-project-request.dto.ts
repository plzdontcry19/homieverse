import { Transform, Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'
import { Helpers } from 'src/helper'

export class FindProjectRequestDTO {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  project_id: number

  @IsString()
  @IsOptional()
  project_name: string

  @Transform((value) => Helpers.convertToDate(value.value))
  @IsDate()
  @IsOptional()
  start_date: Date

  @Transform((value) => Helpers.convertToDate(value.value))
  @IsDate()
  @IsOptional()
  end_date: Date

  @IsNumber()
  @IsOptional()
  limit: number

  @IsNumber()
  @IsOptional()
  offset: number
}
