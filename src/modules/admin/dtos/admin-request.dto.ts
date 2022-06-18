import { IsString } from 'class-validator'
export class AdminRequestDTO {
  @IsString()
  test: string

  @IsString()
  api: string
}
