import { Expose } from 'class-transformer'

export class ProjectOutputEntity {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  description: string
}
