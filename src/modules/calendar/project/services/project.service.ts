import { plainToClass } from 'class-transformer'
import { HttpStatus, Injectable } from '@nestjs/common'
import { EntityManager, getConnection, getManager } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { DbIsolationLevelEnum } from 'src/enums/db-isolation-level.enum'
import { TransactionWrapper } from 'src/entity-managers/trans.wrapper'
import { ICreateProjectInput, IFindProjectInput, IProject } from './proejct.service.interfaces'
import { ProjectRepository } from '../repositories/project.repository'
import { ApiException } from 'src/exceptions/api.exception'
import { BusinessErrorCode } from 'src/const/business-error-code'
import { Helpers } from 'src/helper'

import { AssetRepository } from '../../asset/repositories/asset.repository'
import { ProjectHasAssetRepository } from '../repositories/project-has-asset.repository'
import { MintMethodRepository } from '../../mint-method/repositories/mint-method.repository'
import { MintInfoRepository } from '../repositories/mint-info.repository'
import { InsertProjectResponseDTO } from '../dtos/insert-project-response.dto'
import { ProjectHasMintInfoRepository } from '../repositories/project-has-mint_info.repository'
import { FindProjectResponseDTO } from '../dtos/find-project-response.dto'
import { VotingRepository } from '../../voting/repositories/voting.repository'
import { VotingStatusEnum } from 'src/enums/voting-status.enum'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository, PostgresConnectionEnum.WEB)
    private projectRepository: ProjectRepository,

    @InjectRepository(VotingRepository, PostgresConnectionEnum.WEB)
    private votingRepository: VotingRepository,
  ) {}

  public async findManyProject(params: IFindProjectInput) {
    const { projectId, projectName, startDate, endDate, limit, offset, ipAddress } = params
    const customProjectList = await this.projectRepository.findManyProject({
      projectId,
      projectName,
      startDate,
      endDate,
    })

    const map = new Map<number, IProject>()
    const mapInfoList: string[] = []

    const projectList: IProject[] = []
    for (const customProject of customProjectList) {
      const {
        project_id,
        project_name,
        project_description,
        asset_id,
        mint_info_type,
        mint_info_description,
        price,
        unit,
        start_date,
        end_date,
        mint_method_name,
        mint_method_description,
        mint_info_id,
      } = customProject

      if (!map.has(project_id)) {
        const project: IProject = {
          project_id,
          project_name,
          project_description,
          asset_id_list: [asset_id],
          mint_info_list: [
            {
              mint_info_id,
              mint_info_type,
              mint_info_description,
              price,
              unit,
              start_date,
              end_date,
              mint_method_name,
              mint_method_description,
            },
          ],
          start_date: start_date,
          end_date: endDate,
          mint: 0,
          no_mint: 0,
          not_sure: 0,
          my_voting: null,
          my_description: null,
        }
        map.set(project_id, project)
        mapInfoList.push(`${project_id}_${mint_info_id}`)
      } else {
        const projectMap = map.get(project_id)

        if (!projectMap.asset_id_list.includes(asset_id)) {
          projectMap.asset_id_list.push(asset_id)
        }

        if (!mapInfoList.includes(`${project_id}_${mint_info_id}`)) {
          projectMap.mint_info_list.push({
            mint_info_id,
            mint_info_type,
            mint_info_description,
            price,
            unit,
            start_date,
            end_date,
            mint_method_name,
            mint_method_description,
          })
          mapInfoList.push(`${project_id}_${mint_info_id}`)
        }

        if (start_date && !projectMap.start_date) {
          projectMap.start_date = start_date
        }

        if (start_date && projectMap.start_date) {
          if (start_date.getTime() < projectMap.start_date.getTime()) {
            projectMap.start_date = start_date
          }
        }

        if (end_date && !projectMap.end_date) {
          projectMap.end_date = end_date
        }

        if (end_date && projectMap.end_date) {
          if (end_date.getTime() > projectMap.end_date.getTime()) {
            projectMap.end_date = end_date
          }
        }

        map.set(project_id, projectMap)
      }
    }

    for (const [key, value] of map) {
      const { start_date, end_date } = value

      if (startDate && endDate && end_date) {
        if (start_date.getTime() >= startDate.getTime() && end_date.getTime() <= endDate.getTime()) {
          projectList.push(value)
          continue
        }
      } else if (startDate && endDate && !end_date) {
        if (start_date.getTime() >= startDate.getTime()) {
          projectList.push(value)
          continue
        }
      } else if (startDate) {
        if (start_date.getTime() >= startDate.getTime()) {
          projectList.push(value)
          continue
        }
      } else {
        projectList.push(value)
      }
    }

    let dataResponseList: IProject[] = []
    if (projectList.length > 0) {
      dataResponseList = Helpers.getPaginatedData(projectList, limit, offset)
    }

    for (const dataResponse of dataResponseList) {
      const { project_id } = dataResponse

      const findDataList = await this.votingRepository.findProjectVotingList({
        projectId: project_id,
      })

      const findMyProjectVoting = await this.votingRepository.findOneProjectVoting({
        projectId: project_id,
        ipAddress,
      })

      if (findMyProjectVoting) {
        const { voting_description, voting_status } = findMyProjectVoting
        dataResponse.my_voting = voting_status
        dataResponse.my_description = voting_description
      }

      if (findDataList.length > 0) {
        const { voting_list } = findDataList[0]
        for (const voting of voting_list) {
          if (voting === VotingStatusEnum.MINT) {
            dataResponse.mint++
          } else if (voting === VotingStatusEnum.NO_MINT) {
            dataResponse.no_mint++
          } else if (voting === VotingStatusEnum.NOT_SURE) {
            dataResponse.not_sure++
          }
        }
      }
    }

    return plainToClass(FindProjectResponseDTO, dataResponseList, { excludeExtraneousValues: true })
  }

  public async createProject(params: ICreateProjectInput) {
    const { name, description, assetIdList, mintInfoList } = params

    let returnProjectId: number

    await getManager(PostgresConnectionEnum.WEB).transaction(
      DbIsolationLevelEnum.READ_COMMITTED,
      async (tx: EntityManager): Promise<any> => {
        const task = async () => {
          const projectRepository = tx.getCustomRepository(ProjectRepository)
          const projectHasAssetRepository = tx.getCustomRepository(ProjectHasAssetRepository)
          const assetRepository = tx.getCustomRepository(AssetRepository)
          const mintMethodRepository = tx.getCustomRepository(MintMethodRepository)
          const mintInfoRepository = tx.getCustomRepository(MintInfoRepository)
          const projectHasMintInfoRepository = tx.getCustomRepository(ProjectHasMintInfoRepository)

          const findName = await projectRepository.findOne({
            where: {
              name,
            },
          })

          if (findName) {
            throw new ApiException(BusinessErrorCode.PROJECT_NAME_ALREADY_EXIST, HttpStatus.UNPROCESSABLE_ENTITY)
          }

          const createResult = await projectRepository.createProject({
            name,
            description,
          })

          const { id: projectId } = createResult

          const findAsset = await assetRepository.findByIds(assetIdList)

          if (findAsset.length === 0) {
            throw new ApiException(BusinessErrorCode.ASSET_NOT_FOUND, HttpStatus.NOT_FOUND)
          }

          if (findAsset.length !== assetIdList.length) {
            throw new ApiException(BusinessErrorCode.ASSET_NOT_FOUND, HttpStatus.NOT_FOUND)
          }

          for (const assetId of assetIdList) {
            await projectHasAssetRepository.createHasAsset({
              projectId,
              assetId,
            })
          }

          for (const mintInfo of mintInfoList) {
            const { type, mintMethodId, price, unit, startDate, endDate, description } = mintInfo
            const findMintMethod = await mintMethodRepository.findOne(mintMethodId)

            if (!findMintMethod) {
              throw new ApiException(BusinessErrorCode.MINT_METHOD_NOT_FOUND, HttpStatus.NOT_FOUND)
            }

            const { id: mintInfoId } = await mintInfoRepository.createMintInfo({
              type,
              description,
              mintMethodId,
              price,
              unit,
              startDate,
              endDate,
            })

            await projectHasMintInfoRepository.createHasMintInfo({
              projectId,
              mintInfoId,
            })
          }
          returnProjectId = projectId
        }

        return await TransactionWrapper.runInTransaction(
          getConnection(PostgresConnectionEnum.WEB).createQueryRunner(),
          task,
        )
      },
    )

    return plainToClass(InsertProjectResponseDTO, { project_id: returnProjectId }, { excludeExtraneousValues: true })
  }
}
