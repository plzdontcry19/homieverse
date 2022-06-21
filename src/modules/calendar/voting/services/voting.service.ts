import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { BusinessErrorCode } from 'src/const/business-error-code'
import { TransactionWrapper } from 'src/entity-managers/trans.wrapper'

import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { DbIsolationLevelEnum } from 'src/enums/db-isolation-level.enum'
import { ApiException } from 'src/exceptions/api.exception'
import { EntityManager, getConnection, getManager } from 'typeorm'
import { ProjectHasUserVotingRepository } from '../../project/repositories/project-has-user-voting.repository'
import { ProjectRepository } from '../../project/repositories/project.repository'
import { InsertVotingResponseDTO } from '../dtos/insert-voting-response.dto'
import { VotingRepository } from '../repositories/voting.repository'
import { ICrateVotingInput } from './voting.service.interfaces'

@Injectable()
export class VotingService {
  constructor(
    @InjectRepository(VotingRepository, PostgresConnectionEnum.WEB)
    private votingRepository: VotingRepository,
  ) {}

  public async createVoting(params: ICrateVotingInput) {
    const { projectId, status, description } = params

    let votingId: number

    await getManager(PostgresConnectionEnum.WEB).transaction(
      DbIsolationLevelEnum.READ_COMMITTED,
      async (tx: EntityManager): Promise<any> => {
        const task = async () => {
          const projectRepository = tx.getCustomRepository(ProjectRepository)
          const votingRepository = tx.getCustomRepository(VotingRepository)
          const projectHasUserVotingRepository = tx.getCustomRepository(ProjectHasUserVotingRepository)

          const findProject = await projectRepository.findOne({
            where: {
              id: projectId,
            },
          })

          if (!findProject) {
            throw new ApiException(BusinessErrorCode.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
          }

          const { id } = await votingRepository.createVoting({
            status,
            description,
          })

          votingId = id

          await projectHasUserVotingRepository.createHasUserVoting({
            projectId,
            votingId,
          })
        }

        return await TransactionWrapper.runInTransaction(
          getConnection(PostgresConnectionEnum.WEB).createQueryRunner(),
          task,
        )
      },
    )

    return plainToClass(InsertVotingResponseDTO, { voting_id: votingId }, { excludeExtraneousValues: true })
  }
}
