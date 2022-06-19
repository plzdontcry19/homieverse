import { plainToClass } from 'class-transformer'
import { HttpStatus, Injectable } from '@nestjs/common'
import { EntityManager, getConnection, getManager } from 'typeorm'
import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { DbIsolationLevelEnum } from 'src/enums/db-isolation-level.enum'
import { TransactionWrapper } from 'src/entity-managers/trans.wrapper'
import { ICreateAssetInput, IFindAssetInput, IUpdateAssetInput } from './asset.service.interfaces'
import { Helpers } from 'src/helper'
import { BusinessErrorCode } from 'src/const/business-error-code'
import { ApiException } from 'src/exceptions/api.exception'
import { AssetRepository } from '../repositories/asset.repository'
import { v4 as uuidv4 } from 'uuid'
import { InsertAssetResponseDTO } from '../dtos/insert-asset-response.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { FindAssetResponseDTO } from '../dtos/find-asset-response.dto'

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetRepository, PostgresConnectionEnum.WEB)
    private assetRepository: AssetRepository,
  ) {}

  public async createAsset(params: ICreateAssetInput) {
    const { assetUrl } = params

    let assetId: number

    await getManager(PostgresConnectionEnum.WEB).transaction(
      DbIsolationLevelEnum.READ_COMMITTED,
      async (tx: EntityManager): Promise<any> => {
        const assetRepository = tx.getCustomRepository(AssetRepository)
        const task = async () => {
          const getBase64 = Helpers.getBase64(assetUrl)
          if (!getBase64) {
            throw new ApiException(BusinessErrorCode.INVALID_ASSET_URL, HttpStatus.UNPROCESSABLE_ENTITY)
          }

          const { code: data, mimeType } = getBase64

          const { id } = await assetRepository.createAsset({
            name: uuidv4(),
            data,
            mimeType,
          })
          assetId = id
        }

        return await TransactionWrapper.runInTransaction(
          getConnection(PostgresConnectionEnum.WEB).createQueryRunner(),
          task,
        )
      },
    )

    return plainToClass(InsertAssetResponseDTO, { asset_id: assetId }, { excludeExtraneousValues: true })
  }

  public async findAsset(params: IFindAssetInput) {
    const findAsset = await this.assetRepository.findOne(params.id)
    if (!findAsset) {
      throw new ApiException(BusinessErrorCode.ASSET_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    return plainToClass(FindAssetResponseDTO, findAsset, { excludeExtraneousValues: true })
  }

  public async updateAsset(params: IUpdateAssetInput) {
    const { id, assetUrl } = params

    let assetId: number

    await getManager(PostgresConnectionEnum.WEB).transaction(
      DbIsolationLevelEnum.READ_COMMITTED,
      async (tx: EntityManager): Promise<any> => {
        const assetRepository = tx.getCustomRepository(AssetRepository)
        const task = async () => {
          const findAsset = await this.assetRepository.findOne(id)
          if (!findAsset) {
            throw new ApiException(BusinessErrorCode.ASSET_NOT_FOUND, HttpStatus.NOT_FOUND)
          }

          const getBase64 = Helpers.getBase64(assetUrl)
          if (!getBase64) {
            throw new ApiException(BusinessErrorCode.INVALID_ASSET_URL, HttpStatus.UNPROCESSABLE_ENTITY)
          }

          const { code: data, mimeType } = getBase64
          await assetRepository.updateAsset({
            id,
            data,
            mimeType,
          })
        }

        return await TransactionWrapper.runInTransaction(
          getConnection(PostgresConnectionEnum.WEB).createQueryRunner(),
          task,
        )
      },
    )

    return plainToClass(InsertAssetResponseDTO, { asset_id: assetId }, { excludeExtraneousValues: true })
  }
}
