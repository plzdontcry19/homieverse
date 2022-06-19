import { MintTypeEnum } from 'src/enums/mint-type.enum'

export interface ICrateProjectInput {
  name: string
  description: string
  assetIdList: number[]
  mintInfoList: IMintInfoInput[]
}
export interface IMintInfoInput {
  type: MintTypeEnum
  description: string
  mintMethodId: number
  price: number
  unit: string
  startDate: Date
  endDate: Date
}

export interface IProject {
  project_id: number
  project_name: string
  project_description: string
  asset_id_list: number[]
  mint_info: IMintInfo[]
}

export interface IMintInfo {
  mint_info_id: number
  mint_info_type: MintTypeEnum
  mint_info_description: string
  price: number
  unit: string
  start_date: Date
  end_date: Date
  mint_method_name: string
  mint_method_description: string
}
