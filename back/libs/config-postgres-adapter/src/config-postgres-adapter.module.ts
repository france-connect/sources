import { Module } from '@nestjs/common';

import { PartnersServiceProviderInstanceModule } from '@fc/partners-service-provider-instance';
import { PartnersServiceProviderInstanceVersionModule } from '@fc/partners-service-provider-instance-version';

import { ConfigPostgresAdapterService } from './services';

@Module({
  imports: [
    PartnersServiceProviderInstanceModule,
    PartnersServiceProviderInstanceVersionModule,
  ],
  providers: [ConfigPostgresAdapterService],
  exports: [
    ConfigPostgresAdapterService,
    PartnersServiceProviderInstanceModule,
    PartnersServiceProviderInstanceVersionModule,
  ],
})
export class ConfigPostgresAdapterModule {}
