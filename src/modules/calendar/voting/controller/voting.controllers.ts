import { Body, Controller, HttpCode, HttpStatus, Param, Post, Put, UseFilters, UseInterceptors } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { RealIP } from 'nestjs-real-ip'

import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'

import { InsertVotingRequestDTO } from '../dtos/insert-voting-request.dto'
import { UpdateVotingParamRequestDTO } from '../dtos/update-voting-param-request.dto'
import { UpdateVotingRequestDTO } from '../dtos/update-voting-request.dto'
import { VotingService } from '../services/voting.service'

@Controller('voting')
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
export class VotingController {
  constructor(private votingService: VotingService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'created',
    schema: {
      example: {
        status: 201,
        data: {
          voting_id: 7,
        },
        message: 'success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'project not found',
  })
  async createVoting(@Body() body: InsertVotingRequestDTO, @RealIP() ipAddress: string) {
    const { project_id: projectId, status, description } = body
    return await this.votingService.createVoting({
      projectId,
      status,
      description,
      ipAddress,
    })
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'updated',
  })
  @ApiResponse({
    status: 404,
    description: 'project or voting not found',
  })
  @Put(':id')
  async updateVoting(
    @Param() param: UpdateVotingParamRequestDTO,
    @Body() body: UpdateVotingRequestDTO,
    @RealIP() ipAddress: string,
  ) {
    const { id: projectId } = param
    const { status, description } = body
    return await this.votingService.updateVoting({
      projectId,
      status,
      description,
      ipAddress,
    })
  }

  // @Post()
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({
  //   status: 201,
  //   description: 'created',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'project not found',
  // })
  // async getVoting(@RealIP() ipAddress: string) {
  //   const { project_id: projectId, status, description } = body
  //   // return await this.votingService.findVoting({
  //   // })
  // }
}
