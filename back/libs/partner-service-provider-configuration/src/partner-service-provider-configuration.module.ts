/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceProviderConfiguration } from '@entities/typeorm';

import { PartnerServiceProviderModule } from '@fc/partner-service-provider';

import { PartnerServiceProviderConfigurationService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceProviderConfiguration]),
    PartnerServiceProviderModule,
  ],
  providers: [PartnerServiceProviderConfigurationService],
  exports: [PartnerServiceProviderConfigurationService],
})
export class PartnerServiceProviderConfigurationModule {}
