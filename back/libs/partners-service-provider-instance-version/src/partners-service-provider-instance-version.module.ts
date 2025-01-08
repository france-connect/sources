import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnersServiceProviderInstanceVersion } from '@entities/typeorm';

import { PartnersServiceProviderInstanceVersionService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([PartnersServiceProviderInstanceVersion])],
  providers: [PartnersServiceProviderInstanceVersionService],
  exports: [PartnersServiceProviderInstanceVersionService],
})
export class PartnersServiceProviderInstanceVersionModule {}
