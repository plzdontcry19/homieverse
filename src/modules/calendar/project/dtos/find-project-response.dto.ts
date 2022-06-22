import { Expose, Type } from 'class-transformer'
import { MintTypeEnum } from 'src/enums/mint-type.enum'
import { VotingStatusEnum } from 'src/enums/voting-status.enum'

export class FindProjectResponseDTO {
  @Expose()
  project_id: number

  @Expose()
  project_name: string

  @Expose()
  project_description: string

  @Expose()
  asset_id_list: number[]

  @Expose()
  @Type(() => MintInfoResponseDTO)
  mint_info_list: MintInfoResponseDTO[]

  @Expose()
  mint: number

  @Expose()
  no_mint: number

  @Expose()
  not_sure: number

  @Expose()
  my_voting: VotingStatusEnum

  @Expose()
  my_description: string
}

export class MintInfoResponseDTO {
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
  mint_method_name: string

  @Expose()
  mint_method_description: string
}
