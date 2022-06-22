import { HttpStatus, Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { BusinessErrorCode } from 'src/const/business-error-code'
import { VotingEntity } from 'src/entities/voting.entity'
import { TransactionWrapper } from 'src/entity-managers/trans.wrapper'

import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { DbIsolationLevelEnum } from 'src/enums/db-isolation-level.enum'
import { ApiException } from 'src/exceptions/api.exception'
import { EntityManager, getConnection, getManager } from 'typeorm'
import { ProjectHasUserVotingRepository } from '../../project/repositories/project-has-user-voting.repository'
import { ProjectRepository } from '../../project/repositories/project.repository'
import { InsertVotingResponseDTO } from '../dtos/insert-voting-response.dto'
import { VotingRepository } from '../repositories/voting.repository'
import { ICrateVotingInput, IUpdateVotingInput } from './voting.service.interfaces'

@Injectable()
export class VotingService {
  public async createVoting(params: ICrateVotingInput) {
    const { projectId, status, description, ipAddress = null, userId = null } = params

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

          const findProjectHasUserVoting = await projectHasUserVotingRepository.findOne({
            where: {
              project_id: projectId,
              ip_address: ipAddress,
              user_id: userId,
            },
          })

          if (findProjectHasUserVoting) {
            throw new ApiException(BusinessErrorCode.USER_HAS_VOTED, HttpStatus.UNPROCESSABLE_ENTITY)
          }

          await projectHasUserVotingRepository.createHasUserVoting({
            projectId,
            votingId,
            ipAddress,
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

  public async updateVoting(params: IUpdateVotingInput) {
    const { projectId, status, description, ipAddress = null } = params

    await getManager(PostgresConnectionEnum.WEB).transaction(
      DbIsolationLevelEnum.READ_COMMITTED,
      async (tx: EntityManager): Promise<any> => {
        const task = async () => {
          const projectRepository = tx.getCustomRepository(ProjectRepository)
          const votingRepository = tx.getCustomRepository(VotingRepository)

          const findProject = await projectRepository.findOne({
            where: {
              id: projectId,
            },
          })

          if (!findProject) {
            throw new ApiException(BusinessErrorCode.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
          }

          const findOneVoting = await votingRepository.findOneProjectVoting({
            projectId,
            ipAddress,
          })

          if (!findOneVoting) {
            throw new ApiException(BusinessErrorCode.VOTING_NOT_FOUND, HttpStatus.NOT_FOUND)
          }

          const { voting_id } = findOneVoting

          await votingRepository.update(
            voting_id,
            plainToClass(VotingEntity, {
              status,
              description,
            }),
          )
        }

        return await TransactionWrapper.runInTransaction(
          getConnection(PostgresConnectionEnum.WEB).createQueryRunner(),
          task,
        )
      },
    )
  }

  // public async findVoting(params: IFindVotingInput) {
  //   const { projectIdList, ipAddress } = params

  //   const customProjectList = await this.votingRepository.findManyProject({
  //     projectId,
  //     projectName,
  //     startDate,
  //     endDate
  //   })

  //   return plainToClass(InsertVotingResponseDTO, { voting_id: votingId }, { excludeExtraneousValues: true })
  // }
}
