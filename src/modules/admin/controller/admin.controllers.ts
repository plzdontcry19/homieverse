import { Body, Controller, Get, Post, UseFilters, UseInterceptors } from '@nestjs/common'
import axios from 'axios'
import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'
import { AdminRequestDTO } from '../dtos/admin-request.dto'

@Controller()
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
export class AdminController {
  constructor() {}

  @Get()
  async testing() {
    const result = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto')
    return result.data
  }

  @Post()
  async postest(@Body() body: AdminRequestDTO) {
    return body
  }
}
