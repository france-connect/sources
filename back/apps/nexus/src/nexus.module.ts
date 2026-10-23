import { Module } from '@nestjs/common';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';

import { NexusController } from './controllers';

@Module({
  imports: [AsyncLocalStorageModule],
  controllers: [NexusController],
})
export class NexusModule {}
