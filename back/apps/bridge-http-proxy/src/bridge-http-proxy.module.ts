/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { ExceptionsModule } from '@fc/exceptions';
import { RabbitmqModule } from '@fc/rabbitmq';

import { BridgeHttpProxyController } from './controllers';
import { BridgeHttpProxyService } from './services';

@Global()
@Module({
  imports: [ExceptionsModule, RabbitmqModule.registerFor('BridgeProxy')],
  controllers: [BridgeHttpProxyController],
  providers: [BridgeHttpProxyService],
  exports: [],
})
export class BridgeHttpProxyModule {}
