import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('mint_method')
export class MintMethodEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 64, nullable: false })
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: false, default: true })
  active: boolean

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at: Date
}
