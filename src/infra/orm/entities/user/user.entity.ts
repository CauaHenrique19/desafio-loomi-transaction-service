import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { UserModel } from '@transaction-service/domain/models';
import { StatusEnum } from '@transaction-service/domain/enums';

@Entity({ name: 'tb_users' })
export class User implements UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_id', unique: true })
  clientId: string;

  @Column({ name: 'bank_account' })
  bankAccount: string;

  @Column()
  digit: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
  })
  status: StatusEnum;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
