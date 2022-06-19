import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Response } from 'express'

import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { MemberGuard } from 'src/guards/member.guard'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'

import { FindAssetRequestDTO } from '../dtos/find-asset-request.dto'
import { InsertAssetRequestDTO } from '../dtos/insert-asset-request.dto'
import { UpdateAssetParamRequestDTO } from '../dtos/update-asset-param-request.dto'
import { UpdateAssetRequestDTO } from '../dtos/update-asset-request.dto'
import { AssetService } from '../services/asset.service'

@Controller('asset')
@UseFilters(ApiExceptionFilter)
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Post()
  @UseInterceptors(ApiResponseInterceptor)
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'create asset successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'invalid credential',
  })
  @ApiResponse({
    status: 500,
    description: 'internal sever error',
  })
  @ApiBearerAuth()
  public async createAsset(@Body() body: InsertAssetRequestDTO) {
    const { asset_url } = body

    return await this.assetService.createAsset({
      assetUrl: asset_url.trim(),
    })
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'find asset successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'asset not found',
  })
  @ApiResponse({
    status: 500,
    description: 'internal sever error',
  })
  public async findAsset(@Param() param: FindAssetRequestDTO, @Res() res: Response) {
    const { id } = param

    const asset = await this.assetService.findAsset({
      id,
    })

    const { mime_type, data } = asset
    return res.status(200).set('Content-Type', mime_type).send(Buffer.from(data, 'base64'))
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(MemberGuard)
  @ApiResponse({
    status: 200,
    description: 'update asset successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'asset not found',
  })
  @ApiResponse({
    status: 500,
    description: 'internal sever error',
  })
  public async updateAsset(@Param() param: UpdateAssetParamRequestDTO, @Body() body: UpdateAssetRequestDTO) {
    await this.assetService.updateAsset({
      id: param.id,
      assetUrl: body.asset_url,
    })
  }
}
