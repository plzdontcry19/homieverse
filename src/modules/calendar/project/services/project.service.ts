import { plainToClass } from 'class-transformer'
import { HttpStatus, Injectable } from '@nestjs/common'
import { EntityManager, getConnection, getManager } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { DbIsolationLevelEnum } from 'src/enums/db-isolation-level.enum'
import { TransactionWrapper } from 'src/entity-managers/trans.wrapper'
import { ICrateProjectInput, IProject } from './proejct.service.interfaces'
import { ProjectRepository } from '../repositories/project.repository'
import { ApiException } from 'src/exceptions/api.exception'
import { BusinessErrorCode } from 'src/const/business-error-code'

import { AssetRepository } from '../../asset/repositories/asset.repository'
import { ProjectHasAssetRepository } from '../repositories/project-has-asset.repository'
import { MintMethodRepository } from '../../mint-method/repositories/mint-method.repository'
import { MintInfoRepository } from '../repositories/mint-info.repository'
import { InsertProjectResponseDTO } from '../dtos/insert-project-response.dto'
import { ProjectHasMintInfoRepository } from '../repositories/project-has-mint_info.repository'
import { FindProjectResponseDTO } from '../dtos/find-project-response.dto'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository, PostgresConnectionEnum.WEB)
    private projectRepository: ProjectRepository,
  ) {}

  public async findManyProject() {
    const customProjectList = await this.projectRepository.findManyProject()

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
          mint_info: [
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
        }
        map.set(project_id, project)
        mapInfoList.push(`${project_id}_${mint_info_id}`)
      } else {
        const projectMap = map.get(project_id)
        if (!projectMap.asset_id_list.includes(asset_id)) {
          projectMap.asset_id_list.push(asset_id)
        }

        if (!mapInfoList.includes(`${project_id}_${mint_info_id}`)) {
          projectMap.mint_info.push({
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
        map.set(project_id, projectMap)
      }
    }

    map.forEach((element) => {
      projectList.push(element)
    })

    return plainToClass(FindProjectResponseDTO, projectList, { excludeExtraneousValues: true })
  }

  public async createProject(params: ICrateProjectInput) {
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
