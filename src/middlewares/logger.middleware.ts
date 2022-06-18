import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { ApiLogger } from 'src/loggers/api-logger'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: ApiLogger) { }

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `[${req['context'].requestId}] ` +
      `METADATA-REQUEST ` +
      `PATH: ${req.originalUrl}, ` +
      `METHOD: ${req.method}, ` +
      `USER-AGENT: ${req.headers['user-agent'] || '-'}, ` +
      `CONTENT-TYPE: ${req.headers['content-type'] || '-'}, ` +
      `CONTENT-DISPOSITION: ${req.headers['content-disposition'] || '-'}, ` +
      `CONTENT-ENCODING: ${req.headers['content-encoding'] || '-'}, ` +
      `AUTHORIZATION: ${req.headers.authorization || '-'}`,
    )
    this.logger.log(`[${req['context'].requestId}] REQUEST-PAYLOAD`, req.body)
    next()
  }
}
