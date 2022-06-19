import { Expose } from 'class-transformer'
import { MintTypeEnum } from 'src/enums/mint-type.enum'

export class CustomProjectOutputEntity {
  @Expose()
  project_id: number

  @Expose()
  project_name: string

  @Expose()
  project_description: string

  @Expose()
  asset_id: number

  // @Expose()
  // mint_info_id: number

  @Expose()
  mint_info_type: MintTypeEnum

  @Expose()
  mint_info_description: string

  @Expose()
  price: number

  @Expose()
  unit: string

  @Expose()
  start_date: Date

  @Expose()
  end_date: Date

  @Expose()
  mint_info_id: number

  @Expose()
  mint_method_id: number

  @Expose()
  mint_method_name: string

  @Expose()
  mint_method_description: string
}
