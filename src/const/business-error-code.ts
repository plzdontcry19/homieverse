export interface IBusinessErrorCode {
  readonly code: string
  readonly message: string
}

export class BusinessErrorCode {
  static USER_NOT_FOUND: IBusinessErrorCode = {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
  }

  static PROJECT_NAME_ALREADY_EXIST: IBusinessErrorCode = {
    code: 'PROJECT_NAME_ALREADY_EXIST',
    message: 'Project name already exists',
  }

  static MINT_METHOD_NAME_ALREADY_EXIST: IBusinessErrorCode = {
    code: 'MINT_METHOD_NAME_ALREADY_EXIST',
    message: 'Mint method already exists',
  }
  static ASSET_NOT_FOUND: IBusinessErrorCode = {
    code: 'ASSET_NOT_FOUND',
    message: 'Asset not found',
  }

  static PROJECT_NOT_FOUND: IBusinessErrorCode = {
    code: 'PROJECT_NOT_FOUND',
    message: 'Proeject not found',
  }

  static VOTING_NOT_FOUND: IBusinessErrorCode = {
    code: 'VOTING_NOT_FOUND',
    message: 'Voting not found',
  }

  static USER_HAS_VOTED: IBusinessErrorCode = {
    code: 'USER_HAS_VOTING',
    message: 'User has voting',
  }

  static MINT_METHOD_NOT_FOUND: IBusinessErrorCode = {
    code: 'MINT_METHOD_NOT_FOUND',
    message: 'Mint method not found',
  }

  static INVALID_ASSET_URL: IBusinessErrorCode = {
    code: 'INVALID_ASSET_URL',
    message: 'Invalid asset url',
  }
}
