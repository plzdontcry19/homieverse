import { Expose } from 'class-transformer'

export class FindMintMethodResponseDTO {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  description: string
}
