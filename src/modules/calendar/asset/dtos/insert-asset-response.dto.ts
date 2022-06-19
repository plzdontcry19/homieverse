import { Expose } from 'class-transformer'

export class InsertAssetResponseDTO {
  @Expose()
  asset_id: number
}
