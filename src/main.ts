import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
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

  const config = new DocumentBuilder()
    .setTitle(`${((process.env.APP_ENV as string) || 'HELLO').toUpperCase()} API DOC`)
    .setDescription('for testing with only')
    .setContact(
      'Naraphat Sanujit',
      'https://www.linkedin.com/in/naraphat-sanujit-a30686224/',
      'naraphat.naem@gmail.com',
    )
    .setVersion('1.0')
    .addTag(process.env.APP_ENV)
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.HTTP_PORT)
}
bootstrap()
