import { Routes } from '@nestjs/core'
import { AppModule } from './app.module'
import { AdminModule } from './modules/admin/admin.module'

export const ModuleRoutes: Routes = [
  {
    path: '/',
    module: AppModule,
  },
  {
    path: '/admin',
    module: AdminModule,
  },
]
