import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

import { v4 as uuid } from 'uuid'

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuid()
    if (req['context']) {
      req['context'].requestId = requestId
    } else {
      req['context'] = { requestId }
    }
    next()
  }
}
