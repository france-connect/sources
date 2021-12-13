/* istanbul ignore file */

// declarative file
import { Module } from '@nestjs/common';

import { RabbitmqModule } from '@fc/rabbitmq';

import { TracksService } from './services';

@Module({
  imports: [RabbitmqModule.registerFor('Tracks')],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
