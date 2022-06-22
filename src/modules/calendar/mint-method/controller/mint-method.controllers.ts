import {
  Body,
  Controller,
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
import { ApiBearerAuth, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { MemberGuard } from 'src/guards/member.guard'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'

import { InsertMintMethodRequestDTO } from '../dtos/insert-mint-method-request.dto'
import { UpdateMintMethodParamRequestDTO } from '../dtos/update-mint-method-param-request.dto'
import { UpdateMintMethodRequestDTO } from '../dtos/update-mint-method-request.dto'
import { MintMethodService } from '../services/mint-method.service'

@Controller('mint-method')
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
export class MintMethodController {
  constructor(private mintMethodService: MintMethodService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(MemberGuard)
  @ApiResponse({
    status: 200,
    description: 'sucess',
    schema: {
      example: {
        status: 200,
        data: [
          {
            id: 3,
            name: 'test',
            description: 'test',
          },
        ],
        message: 'success',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'valid credential',
  })
  @ApiResponse({
    status: 422,
    description: 'exist',
  })
  @ApiBearerAuth()
  async findMintMethod() {
    return await this.mintMethodService.findMintMethod()
  }

  @Post()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'created',
  })
  @ApiUnauthorizedResponse({
    description: 'valid credential',
  })
  @ApiBearerAuth()
  async createMintMethod(@Body() body: InsertMintMethodRequestDTO) {
    const { name, description } = body
    return await this.mintMethodService.createMintMethod({
      name,
      description,
    })
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(MemberGuard)
  @ApiResponse({
    status: 200,
    description: 'updated',
  })
  @ApiUnauthorizedResponse({
    description: 'valid credential',
  })
  @ApiBearerAuth()
  public async updateMintMethod(
    @Param() param: UpdateMintMethodParamRequestDTO,
    @Body() body: UpdateMintMethodRequestDTO,
  ) {
    const { name, description } = body
    await this.mintMethodService.updateMintMethod({
      id: param.id,
      name,
      description,
    })
  }
}
