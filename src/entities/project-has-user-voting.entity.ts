import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('project_has_user_voting')
export class ProjectHasUserVotingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int4', nullable: false })
  project_id: number

  @Column({ type: 'int4', nullable: false })
  voting_id: number

  @Column({ type: 'int4', nullable: true })
  user_id: number

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip_address: string

  @Column({ nullable: false, default: true })
  active: boolean

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at: Date
}
