/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceProvider } from '@entities/typeorm';

import { PartnerServiceProviderService } from './partner-service-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvider])],
  providers: [PartnerServiceProviderService],
  exports: [PartnerServiceProviderService],
})
export class PartnerServiceProviderModule {}
