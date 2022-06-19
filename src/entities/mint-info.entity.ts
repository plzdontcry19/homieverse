import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('mint_info')
export class MintInfoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 64, nullable: false })
  type: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'int4', nullable: false })
  mint_method_id: number

  @Column({ type: 'float4', nullable: true })
  price: string

  @Column({ type: 'varchar', length: 64, nullable: true })
  unit: string

  @Column({ nullable: false, default: true })
  active: boolean

  @Column({ type: 'timestamp', nullable: false })
  start_date: Date

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at: Date
}
