/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ExceptionsModule } from '@fc/exceptions';
import { RabbitmqModule } from '@fc/rabbitmq';

import { BridgeHttpProxyController } from './controllers';
import { BridgeHttpProxyService } from './services';

@Global()
@Module({
  imports: [
    AsyncLocalStorageModule,
    ExceptionsModule.withoutTracking(),
    RabbitmqModule.registerFor('BridgeProxy'),
  ],
  controllers: [BridgeHttpProxyController],
  providers: [BridgeHttpProxyService],
  exports: [],
})
export class BridgeHttpProxyModule {}
