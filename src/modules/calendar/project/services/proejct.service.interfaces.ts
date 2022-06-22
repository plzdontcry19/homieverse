import { MintTypeEnum } from 'src/enums/mint-type.enum'
import { VotingStatusEnum } from 'src/enums/voting-status.enum'

export interface IFindProjectInput {
  projectId?: number
  projectName?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
  ipAddress: string
}

export interface ICreateProjectInput {
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
  mint: number
  no_mint: number
  not_sure: number
  asset_id_list: number[]
  mint_info_list: IMintInfo[]
  start_date: Date
  end_date: Date
  my_voting: VotingStatusEnum
  my_description: string
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
