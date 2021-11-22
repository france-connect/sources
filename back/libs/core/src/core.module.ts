/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ServiceProviderAdapterMongoModule } from '@fc/service-provider-adapter-mongo';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import { CoreService } from './services';

@Module({
  imports: [
    ServiceProviderAdapterMongoModule,
    SessionModule,
    TrackingModule.forLib(),
  ],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
