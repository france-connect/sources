import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnersAccount } from '@entities/typeorm';

import { TypeormModule } from '@fc/typeorm';

import { PartnersAccountService } from './services/partners-account.service';

@Module({})
export class PartnersAccountModule {
  static register(accessControlModule: DynamicModule): DynamicModule {
    return {
      module: PartnersAccountModule,
      imports: [
        TypeormModule,
        TypeOrmModule.forFeature([PartnersAccount]),
        accessControlModule,
      ],
      providers: [PartnersAccountService],
      exports: [PartnersAccountService],
    };
  }
}
