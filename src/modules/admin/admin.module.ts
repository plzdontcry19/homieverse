import { Module } from '@nestjs/common'
import { ApiLogger } from 'src/loggers/api-logger'
import { Services } from './admin.services'
import { Controllers } from './admin.controllers'

@Module({
  imports: [],
  providers: [ApiLogger, ...Services],
  controllers: Controllers,
})
export class AdminModule {}
