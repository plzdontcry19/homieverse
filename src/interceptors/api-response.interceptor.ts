import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

export interface Response<T> {
  data: T
}

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const status: number = context?.switchToHttp()?.getResponse()?.statusCode
    return next.handle().pipe(map((data: any) => ({ status, data, message: 'success' })))
  }
}
