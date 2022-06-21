import { Controller, Get, Ip } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'hello! ' + (process.env.APP_ENV ? process.env.APP_ENV : 'welcome to API')
  }

  @Get('ip')
  getPing(@Ip() ip: string): string {
    return `my ip is ${ip}`
  }
}
