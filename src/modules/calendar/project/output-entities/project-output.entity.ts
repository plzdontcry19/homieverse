import { Expose } from 'class-transformer'

export class ProjectOutputEntity {
  @Expose()
  id: number

  @Expose()
  name: number

  @Expose()
  description: string
}
