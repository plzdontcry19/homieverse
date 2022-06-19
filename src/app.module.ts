import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { Entities } from './entities'
import { PostgresConnectionEnum } from './enums/database.connection'
import { GlobalModule } from './global.module'
import { TimeoutInterceptor } from './interceptors/timeout.interceptor'
import { Loggers } from './loggers/intex'
import { ContextMiddleware } from './middlewares/context.middleware'
import { LoggerMiddleware } from './middlewares/logger.middleware'
import { Modules } from './modules'
import { ModuleRoutes } from './router.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      name: PostgresConnectionEnum.WEB,
      imports: [ConfigModule],
      useFactory: () => ({
        entities: Entities,
        type: 'postgres',
        url: process.env.DATABASE_URI as string,
        useUTC: false,
        logging: process.env.VERSION === 'local',
      }),
    }),
    RouterModule.register(ModuleRoutes),
    GlobalModule,
    ...Modules,
  ],
  controllers: [AppController],
  providers: [
    ...Loggers,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    ModuleRoutes.map((m) => {
      consumer.apply(ContextMiddleware, LoggerMiddleware).forRoutes(m.path)
    })
  }
}
