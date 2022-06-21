import { Body, Controller, HttpCode, HttpStatus, Ip, Post, UseFilters, UseInterceptors } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ApiExceptionFilter } from 'src/exceptions/api-exception.filter'
import { ApiResponseInterceptor } from 'src/interceptors/api-response.interceptor'

import { InsertVotingRequestDTO } from '../dtos/insert-voting-request.dto'
import { VotingService } from '../services/voting.service'

@Controller('voting')
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
export class VotingController {
  constructor(private votingService: VotingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'created',
  })
  @ApiResponse({
    status: 404,
    description: 'project not found',
  })
  async createVoting(@Body() body: InsertVotingRequestDTO) {
    const { project_id: projectId, status, description } = body
    return await this.votingService.createVoting({
      projectId,
      status,
      description,
    })
  }
}
