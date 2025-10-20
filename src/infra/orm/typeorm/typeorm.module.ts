import { Module } from '@nestjs/common';

import { typeormProvider } from './typeorm.provider';

@Module({
  providers: [typeormProvider],
  exports: [typeormProvider],
})
export class TypeormModule {}
