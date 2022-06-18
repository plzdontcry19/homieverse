import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'hello! ' + (process.env.APP_ENV ? process.env.APP_ENV : 'welcome to API')
  }
}
