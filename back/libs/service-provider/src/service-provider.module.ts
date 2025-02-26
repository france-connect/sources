import { Module } from '@nestjs/common';

import { ServiceProviderService } from './services';

@Module({
  providers: [ServiceProviderService],
  exports: [ServiceProviderService],
})
export class ServiceProviderModule {}
