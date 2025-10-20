import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { TransactionModel } from '@transaction-service/domain/models';
import { ColumnNumericTransformer } from '@transaction-service/infra/orm/transformers';
import { User } from '@transaction-service/infra/orm/entities';

@Entity({ name: 'tb_transactions' })
export class Transaction implements TransactionModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sender_client_id' })
  senderClientId: string;

  @Column({ name: 'receiver_client_id' })
  receiverClientId: string;

  @Column('numeric', {
    precision: 16,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amout: number;

  @Column()
  description: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_client_id', referencedColumnName: 'clientId' })
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_client_id', referencedColumnName: 'clientId' })
  receiver: User;
}
