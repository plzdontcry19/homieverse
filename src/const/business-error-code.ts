export interface IBusinessErrorCode {
  readonly code: string
  readonly message: string
}

export class BusinessErrorCode {
  private constructor() {}

  static USER_NOT_FOUND: IBusinessErrorCode = {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
  }
}
