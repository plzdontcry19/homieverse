import { MintTypeEnum } from 'src/enums/mint-type.enum'

export interface ICrateProjectInput {
  name: string
  description: string
  assetIdList: number[]
  mintInfoList: IMintInfo[]
}

export interface IMintInfo {
  type: MintTypeEnum
  description: string
  mintMethodId: number
  price: number
  unit: string
  startDate: Date
  endDate: Date
}
