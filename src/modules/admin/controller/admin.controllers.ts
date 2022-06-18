import { Body, Controller, Post, UseFilters, UseInterceptors } from '@nestjs/common'
import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'
import { AdminRequestDTO } from '../dtos/admin-request.dto'

@Controller()
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
export class AdminController {
  constructor() {}

  @Post()
  testing(@Body() body: AdminRequestDTO): any {
    return body
  }
}
