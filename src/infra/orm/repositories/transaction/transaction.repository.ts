import { EntityTarget, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import {
  CreateTransactionRepository,
  FindTransactionByIdRepository,
} from '@transaction-service/data/protocols/db';
import { AppDataSource } from '@transaction-service/infra/orm/typeorm/data-source';
import { Transaction } from '@transaction-service/infra/orm/entities';
import { TRANSACTION_REPOSITORY } from '@transaction-service/infra/orm/typeorm/typeorm.repositories';

export class TransactionRepository
  implements CreateTransactionRepository, FindTransactionByIdRepository
{
  private readonly transactionRepository: Repository<Transaction>;

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly Transaction: EntityTarget<Transaction>,
  ) {
    this.transactionRepository = AppDataSource.getRepository(this.Transaction);
  }

  async create(
    parameters: CreateTransactionRepository.Parameters,
  ): Promise<CreateTransactionRepository.Result> {
    const transaction = new Transaction();
    Object.assign(transaction, parameters);

    return this.transactionRepository.save(transaction);
  }

  async find(
    parameters: FindTransactionByIdRepository.Parameters,
  ): Promise<FindTransactionByIdRepository.Result> {
    return this.transactionRepository.findOneBy({ id: parameters.id });
  }
}
