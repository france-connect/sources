import { Module } from '@nestjs/common';

import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { RabbitmqModule } from '@fc/rabbitmq';

import { CsmrAccountClientService } from './services';

@Module({
  imports: [
    RabbitmqModule.registerFor('AccountHigh'),
    RabbitmqModule.registerFor('AccountLegacy'),
    CryptographyFcpModule,
  ],
  providers: [CsmrAccountClientService],
  exports: [CsmrAccountClientService],
})
export class CsmrAccountClientModule {}
