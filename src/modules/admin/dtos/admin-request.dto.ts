import { IsString } from 'class-validator'
export class AdminRequestDTO {
  @IsString()
  key: string

  @IsString()
  value: string
}
