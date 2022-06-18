import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core'
import { AppController } from './app.controller'
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
    RouterModule.register(ModuleRoutes),
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
