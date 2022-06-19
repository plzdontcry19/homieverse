import { Module } from '@nestjs/common'
import { Services } from './admin.services'
import { Controllers } from './admin.controllers'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Repositories } from './admin.repositories'
import { PostgresConnectionEnum } from 'src/enums/database.connection'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forFeature([...Repositories], PostgresConnectionEnum.WEB),
  ],
  providers: [...Services,],
  controllers: Controllers,
})
export class AdminModule { }
