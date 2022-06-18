import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ApiLogger } from 'src/loggers/api-logger'
import { ApiException } from './api.exception'

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: ApiLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const request = context.getRequest<Request>()
    const response = context.getResponse<Response>()

    if (typeof exception.getResponse === 'function') {
      this.logger.warn(
        `[${request['context'].requestId}] ACTUAL-ERR-RESPONSE ${JSON.stringify(exception.getResponse())}`,
      )
    }

    this.logger.error(`[${request['context'].requestId}] ${exception.stack}`)

    if (exception instanceof ApiException) {
      response.status(exception.getStatus()).json({
        status: exception.getStatus(),
        errorCode: exception.errorCode,
        message: exception.message,
      })
    } else {
      const error: any = this._getErrorObject(exception)
      exception = exception instanceof BadRequestException ? new BadRequestException() : exception

      const except = this._allowExceptionToClient(exception)
      response.status(except.getStatus()).send({ ...(except.getResponse() as any), error })
    }
  }

  private _allowExceptionToClient(exception: HttpException) {
    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException ||
      exception instanceof RequestTimeoutException ||
      exception instanceof BadRequestException ||
      exception instanceof NotFoundException
    ) {
      return exception
    }
    return new InternalServerErrorException()
  }

  private _getErrorObject(exception: HttpException): any {
    if (exception instanceof BadRequestException) {
      if (typeof exception.getResponse() === 'object') {
        return (exception.getResponse() as any)?.message
      }
    } else {
      return undefined
    }
  }
}
