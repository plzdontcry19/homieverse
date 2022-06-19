import { plainToClass } from 'class-transformer'
import { HttpStatus, Injectable } from '@nestjs/common'
import { EntityManager, getConnection, getManager } from 'typeorm'
import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { DbIsolationLevelEnum } from 'src/enums/db-isolation-level.enum'
import { TransactionWrapper } from 'src/entity-managers/trans.wrapper'
import { ICrateProjectInput } from './proejct.service.interfaces'
import { ProjectRepository } from '../repositories/project.repository'
import { ApiException } from 'src/exceptions/api.exception'
import { BusinessErrorCode } from 'src/const/business-error-code'
import { AssetRepository } from '../../asset/repositories/asset.repository'
import { ProjectHasAssetRepository } from '../repositories/project-has-asset.repository'
import { MintMethodRepository } from '../../mint-method/repositories/mint-method.repository'
import { MintInfoRepository } from '../repositories/mint-info.repository'
import { InsertProjectResponseDTO } from '../dtos/insert-project-response.dto'

@Injectable()
export class ProjectService {
  constructor() {} // private testingRepo: TestingRepository // @InjectRepository(TestingRepository, PostgresConnectionEnum.WEB)

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

            await mintInfoRepository.createMintInfo({
              type,
              description,
              mintMethodId,
              price,
              unit,
              startDate,
              endDate,
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

    plainToClass(InsertProjectResponseDTO, { project_id: returnProjectId }, { excludeExtraneousValues: true })
  }
  public async trx() {
    await getManager(PostgresConnectionEnum.WEB).transaction(
      DbIsolationLevelEnum.SERIALIZABLE,

      async (tx: EntityManager): Promise<any> => {
        const task = async () => {
          throw new Error('helo')
        }

        return await TransactionWrapper.runInTransaction(
          getConnection(PostgresConnectionEnum.WEB).createQueryRunner(),
          task,
        )
      },
    )
  }
}
