import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('testing')
export class TestingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 64 })
  key: string

  @Column({ type: 'varchar', length: 64 })
  value: string
}
