import { Expose } from 'class-transformer'

export class InsertProjectResponseDTO {
  @Expose()
  project_id: number
}
