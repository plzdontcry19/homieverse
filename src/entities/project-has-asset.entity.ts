import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('project_has_asset')
export class ProjectHasAssetEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int4', nullable: false })
  project_id: number

  @Column({ type: 'int4', nullable: false })
  asset_id: number

  @Column({ nullable: false, default: true })
  active: boolean

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at: Date
}
