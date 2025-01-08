import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { PartnersServiceProviderInstanceService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([PartnersServiceProviderInstance])],
  providers: [PartnersServiceProviderInstanceService],
  exports: [PartnersServiceProviderInstanceService],
})
export class PartnersServiceProviderInstanceModule {}
