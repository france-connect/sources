import { Module } from '@nestjs/common';

import { RabbitmqModule } from '@fc/rabbitmq';

import { CsmrTracksClientService } from './services';

@Module({
  imports: [RabbitmqModule.registerFor('Tracks')],
  providers: [CsmrTracksClientService],
  exports: [CsmrTracksClientService],
})
export class TracksModule {}
