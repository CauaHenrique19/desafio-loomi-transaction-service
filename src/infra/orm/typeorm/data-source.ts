import { DataSource } from 'typeorm';
import { User, Transaction } from '@transaction-service/infra/orm/entities';
import { CONFIG } from 'src/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: CONFIG.DATABASE_HOST,
  port: CONFIG.DATABASE_PORT,
  username: CONFIG.DATABASE_USERNAME,
  password: CONFIG.DATABASE_PASSWORD,
  database: CONFIG.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Transaction],
  subscribers: [],
  migrations: [],
  ssl: CONFIG.NODE_ENV === 'development' ? false : true,
  extra:
    CONFIG.NODE_ENV === 'development'
      ? {}
      : {
          ssl: {
            rejectUnauthorized: false,
          },
        },
});
