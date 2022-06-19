import { Routes } from '@nestjs/core'
import { AppModule } from './app.module'
import { CalendarModule } from './modules/calendar/calendar.module'

export const ModuleRoutes: Routes = [
  {
    path: '/',
    module: AppModule,
  },
  {
    path: '/calendar',
    module: CalendarModule,
  },
]
