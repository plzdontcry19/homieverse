import { plainToClass } from 'class-transformer'
import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, getManager } from 'typeorm'

import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { DbIsolationLevelEnum } from 'src/enums/db-isolation-level.enum'
import { TransactionWrapper } from 'src/entity-managers/trans.wrapper'
import { ICreateMintMethodInput, IUpdateMintMethodInput } from './asset.service.interfaces'
import { BusinessErrorCode } from 'src/const/business-error-code'
import { ApiException } from 'src/exceptions/api.exception'
import { MintMethodRepository } from '../repositories/mint-method.repository'
import { InsertMintMethodResponseDTO } from '../dtos/insert-mint-method-response.dto'
import { FindMintMethodResponseDTO } from '../dtos/find-mint-method-response.dto'

@Injectable()
export class MintMethodService {
  constructor(
    @InjectRepository(MintMethodRepository, PostgresConnectionEnum.WEB)
    private mintMethodRepository: MintMethodRepository,
  ) {}

  public async createMintMethod(params: ICreateMintMethodInput) {
    const { name, description } = params

    let mintMethodId: number

    await getManager(PostgresConnectionEnum.WEB).transaction(
      DbIsolationLevelEnum.READ_COMMITTED,
      async (tx: EntityManager): Promise<any> => {
        const mintMethodRepository = tx.getCustomRepository(MintMethodRepository)
        const task = async () => {
          const findName = await mintMethodRepository.findOne({
            where: {
              name,
            },
          })

          if (findName) {
            throw new ApiException(BusinessErrorCode.MINT_METHOD_NAME_ALREADY_EXIST, HttpStatus.UNPROCESSABLE_ENTITY)
          }

          const { id } = await mintMethodRepository.createMintMethod({
            name,
            description,
          })

          mintMethodId = id
        }

        return await TransactionWrapper.runInTransaction(
          getConnection(PostgresConnectionEnum.WEB).createQueryRunner(),
          task,
        )
      },
    )

    return plainToClass(
      InsertMintMethodResponseDTO,
      { mint_method_id: mintMethodId },
      { excludeExtraneousValues: true },
    )
  }

  public async findMintMethod() {
    const findMintMethod = await this.mintMethodRepository.find()
    return plainToClass(FindMintMethodResponseDTO, findMintMethod, { excludeExtraneousValues: true })
  }

  public async updateMintMethod(params: IUpdateMintMethodInput) {
    const { id, name, description } = params

    await getManager(PostgresConnectionEnum.WEB).transaction(
      DbIsolationLevelEnum.READ_COMMITTED,
      async (tx: EntityManager): Promise<any> => {
        const mintMethodRepository = tx.getCustomRepository(MintMethodRepository)
        const task = async () => {
          const findMethod = await mintMethodRepository.findOne(id)
          if (!findMethod) {
            throw new ApiException(BusinessErrorCode.MINT_METHOD_NOT_FOUND, HttpStatus.NOT_FOUND)
          }

          const findName = await mintMethodRepository.findOne({
            where: {
              name,
            },
          })

          if (findName && findName?.id !== id) {
            throw new ApiException(BusinessErrorCode.MINT_METHOD_NAME_ALREADY_EXIST, HttpStatus.UNPROCESSABLE_ENTITY)
          }

          await mintMethodRepository.updateMintMethod({
            id,
            name,
            description,
          })
        }

        return await TransactionWrapper.runInTransaction(
          getConnection(PostgresConnectionEnum.WEB).createQueryRunner(),
          task,
        )
      },
    )
  }
}
