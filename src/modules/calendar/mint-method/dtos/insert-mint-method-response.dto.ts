import { Expose } from 'class-transformer'

export class InsertMintMethodResponseDTO {
  @Expose()
  mint_method_id: number
}
