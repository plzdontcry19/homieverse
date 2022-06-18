import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'
import { ApiLogger } from './loggers/api-logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useLogger(new ApiLogger())
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(process.env.HTTP_PORT)
}
bootstrap()
