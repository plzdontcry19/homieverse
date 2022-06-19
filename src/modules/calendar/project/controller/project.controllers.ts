import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { MemberGuard } from 'src/guards/member.guard'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'
import { InsertProjectRequestDTO } from '../dtos/insert-project-request.dto'
import { IMintInfo } from '../services/proejct.service.interfaces'
import { ProjectService } from '../services/project.service'

@Controller()
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async findProject() {
    return
  }

  @Post()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: InsertProjectRequestDTO) {
    const { name, description, asset_id_list: assetIdList, mint_info_list } = body

    const mintInfoList: IMintInfo[] = []
    mint_info_list.forEach((element) => {
      const {
        type,
        mint_method_id: mintMethodId,
        price,
        unit,
        start_date: startDate,
        end_date: endDate,
        description,
      } = element
      mintInfoList.push({
        type,
        mintMethodId,
        price,
        unit,
        startDate,
        endDate,
        description,
      })
    })

    return this.projectService.createProject({
      name,
      description,
      assetIdList,
      mintInfoList,
    })
  }

  @Put(':id')
  async edit(@Param('id') id: number) {
    return
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return
  }
}
