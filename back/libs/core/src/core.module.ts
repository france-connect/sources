/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ServiceProviderAdapterMongoModule } from '@fc/service-provider-adapter-mongo';
import { SessionModule } from '@fc/session';

import { CoreTrackingService } from './services';

@Module({
  imports: [ServiceProviderAdapterMongoModule, SessionModule],
  providers: [CoreTrackingService],
  exports: [CoreTrackingService],
})
export class CoreModule {}
