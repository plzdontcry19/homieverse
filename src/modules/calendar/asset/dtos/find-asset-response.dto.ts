import { Expose } from 'class-transformer'

export class FindAssetResponseDTO {
  @Expose()
  data: string

  @Expose()
  mime_type: string
}
