import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'

@Controller()
export class AdminController {
  constructor() { }

  @Get()
  @UseInterceptors(ApiResponseInterceptor)
  getHello(): string {
    return 'testing!!!!'
  }
}
