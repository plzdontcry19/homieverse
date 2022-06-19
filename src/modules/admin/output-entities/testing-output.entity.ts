import { Expose } from 'class-transformer'

export class TestingOutputOutputEntity {
  @Expose()
  id: number

  @Expose()
  key: string

  @Expose()
  value: string
}
