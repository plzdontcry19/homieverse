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

  static MINT_METHOD_NOT_FOUND: IBusinessErrorCode = {
    code: 'MINT_METHOD_NOT_FOUND',
    message: 'Mint method not found',
  }

  static INVALID_ASSET_URL: IBusinessErrorCode = {
    code: 'INVALID_ASSET_URL',
    message: 'Invalid asset url',
  }
}
