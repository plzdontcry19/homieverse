import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'
import { ApiLogger } from './loggers/api-logger'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useLogger(new ApiLogger())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
    }),
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle(`${((process.env.APP_ENV as string) || 'HELLO').toUpperCase()} API DOC`)
    .setDescription('add field in find project, voting unique, update document')
    .setContact(
      'Naraphat Sanujit',
      'https://www.linkedin.com/in/naraphat-sanujit-a30686224/',
      'naraphat.naem@gmail.com',
    )
    .setVersion('1.1.0')
    .addTag(process.env.APP_ENV)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
