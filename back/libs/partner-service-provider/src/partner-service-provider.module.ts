/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountServiceProvider } from '@entities/typeorm';

import { PartnerServiceProviderService } from './partner-service-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountServiceProvider])],
  providers: [PartnerServiceProviderService],
  exports: [PartnerServiceProviderService],
})
export class PartnerServiceProviderModule {}
