import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApiLogger } from './loggers/api-logger'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  providers: [ApiLogger],
  exports: [ApiLogger],
})
export class GlobalModule {}
