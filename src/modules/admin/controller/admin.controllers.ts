import { Body, Controller, Delete, Get, Param, Post, Put, UseFilters, UseInterceptors } from '@nestjs/common'
import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'
import { AdminRequestDTO } from '../dtos/admin-request.dto'
import { AdminService } from '../services/admin.service'

@Controller()
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
export class AdminController {
  constructor(private adminService: AdminService) { }

  @Get()
  async testing() {
    return await this.adminService.findManyTesting()
  }

  @Get('trx')
  async trx() {
    return await this.adminService.trx()
  }


  @Post()
  async create(@Body() body: AdminRequestDTO) {
    return await this.adminService.createTesting()
  }

  @Put(':id')
  async edit(@Param('id') id: number) {
    return await this.adminService.editTesting(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.adminService.deleteTesting(id)
  }
}
