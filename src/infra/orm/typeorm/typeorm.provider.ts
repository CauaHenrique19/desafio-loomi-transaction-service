import { Provider } from '@nestjs/common';
import { AppDataSource } from './data-source';

export const TYPEORM_PROVIDER = 'TYPEORM';

export const typeormProvider: Provider = {
  provide: TYPEORM_PROVIDER,
  useFactory: async () => {
    const datasource = await AppDataSource.initialize();
    return datasource;
  },
};
