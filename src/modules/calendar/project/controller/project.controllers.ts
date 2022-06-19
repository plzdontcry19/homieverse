import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { MemberGuard } from 'src/guards/member.guard'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'
import { InsertProjectRequestDTO } from '../dtos/insert-project-request.dto'
import { IMintInfoInput } from '../services/proejct.service.interfaces'
import { ProjectService } from '../services/project.service'

@Controller('project')
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'find many project,query param soon',
  })
  @ApiResponse({
    status: 500,
    description: 'internal sever error',
  })
  async findProject() {
    return await this.projectService.findManyProject()
  }

  @Post()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'create project successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'valid credential',
  })
  @ApiResponse({
    status: 404,
    description: 'asset not found,mint method not found',
  })
  @ApiResponse({
    status: 500,
    description: 'internal sever error',
  })
  @ApiResponse({
    status: 422,
    description: 'project name is exist',
  })
  @ApiBearerAuth()
  async createProject(@Body() body: InsertProjectRequestDTO) {
    const { name, description, asset_id_list: assetIdList, mint_info_list } = body

    const mintInfoList: IMintInfoInput[] = []
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
}
