import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnersServiceProvider } from '@entities/typeorm';

import { PartnersServiceProviderService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([PartnersServiceProvider])],
  providers: [PartnersServiceProviderService],
  exports: [PartnersServiceProviderService],
})
export class PartnersServiceProviderModule {}
