/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { BrokerProxyController } from './controllers';

@Global()
@Module({
  imports: [],
  controllers: [BrokerProxyController],
  providers: [],
  exports: [],
})
export class RieBridgeProxyModule {}
