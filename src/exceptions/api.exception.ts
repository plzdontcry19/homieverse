import { HttpException, HttpStatus } from '@nestjs/common'
import { IBusinessErrorCode } from 'src/const/business-error-code'

export class ApiException extends HttpException {
  private _errorCode: string

  constructor(businessErrorCode: IBusinessErrorCode, statusCode: HttpStatus) {
    super(businessErrorCode.message, statusCode)
    this._errorCode = businessErrorCode.code
  }

  public get errorCode(): string {
    return this._errorCode
  }
}
