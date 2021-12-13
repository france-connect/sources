/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { RabbitmqModule } from '@fc/rabbitmq';

import { BrokerProxyController } from './controllers';
import { BrokerProxyService } from './services';

@Global()
@Module({
  imports: [RabbitmqModule.registerFor('BridgeProxy')],
  controllers: [BrokerProxyController],
  providers: [BrokerProxyService],
  exports: [],
})
export class RieBridgeProxyModule {}
