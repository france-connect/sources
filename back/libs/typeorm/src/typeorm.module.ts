import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeormService } from './services';

@Global()
@Module({
  imports: [TypeOrmModule],
  providers: [TypeormService],
  exports: [TypeOrmModule, TypeormService],
})
export class TypeormModule {}
