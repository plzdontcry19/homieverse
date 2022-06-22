import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { RealIP } from 'nestjs-real-ip'
import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { MemberGuard } from 'src/guards/member.guard'

import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'
import { FindProjectRequestDTO } from '../dtos/find-project-request.dto'
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
    schema: {
      example: {
        status: 200,
        data: [
          {
            project_id: 1,
            project_name: 'test',
            project_description: 'helo',
            asset_id_list: [1],
            mint_info_list: [
              {
                mint_info_type: 'public',
                mint_info_description: null,
                price: 0.2,
                unit: 'ETH',
                start_date: '2022-10-24T09:10:45.000Z',
                end_date: '2022-10-28T09:10:45.000Z',
                mint_method_name: 'test',
                mint_method_description: 'test',
              },
            ],
            mint: 1,
            no_mint: 0,
            not_sure: 0,
            my_voting: 'mint',
            my_description: null,
          },
          {
            project_id: 2,
            project_name: 'oolong-tea',
            project_description: 'oolong-tea',
            asset_id_list: [2, 1],
            mint_info_list: [
              {
                mint_info_type: 'private',
                mint_info_description: null,
                price: 0.08,
                unit: 'ETH',
                start_date: '2022-09-28T09:10:45.000Z',
                end_date: '2022-09-29T09:10:45.000Z',
                mint_method_name: 'test',
                mint_method_description: 'test',
              },
              {
                mint_info_type: 'public',
                mint_info_description: null,
                price: 0.2,
                unit: 'ETH',
                start_date: '2022-10-24T09:10:45.000Z',
                end_date: '2022-10-28T09:10:45.000Z',
                mint_method_name: 'test',
                mint_method_description: 'test',
              },
            ],
            mint: 1,
            no_mint: 0,
            not_sure: 0,
            my_voting: 'mint',
            my_description: null,
          },
        ],
        message: 'success',
      },
    },
    description: 'find many project',
  })
  @ApiResponse({
    status: 500,
    description: 'internal sever error',
  })
  @ApiQuery({
    name: 'project_id',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'project_name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'start_date',
    required: false,
    type: Number,
    description: 'https://www.unixtimestamp.com/',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    type: Number,
    description: 'https://www.unixtimestamp.com/',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'default : 20',
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  async findProject(@Query() params: FindProjectRequestDTO, @RealIP() ipAddress: string) {
    const {
      project_id: projectId,
      project_name: projectName,
      start_date: startDate,
      end_date: endDate,
      limit,
      offset,
    } = params
    return await this.projectService.findManyProject({
      projectId,
      projectName,
      startDate,
      endDate,
      limit,
      offset,
      ipAddress,
    })
  }

  @Post()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'create project successfully',
    schema: {
      example: {
        status: 201,
        data: {
          project_id: 3,
        },
        message: 'success',
      },
    },
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

    return await this.projectService.createProject({
      name,
      description,
      assetIdList,
      mintInfoList,
    })
  }
}
