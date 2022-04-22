/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { ExceptionsModule } from '@fc/exceptions';
import { LoggerModule } from '@fc/logger-legacy';
import { RabbitmqModule } from '@fc/rabbitmq';

import { CsmrAggregateTracksController } from './controllers';
import { CsmrAggregrateTracksFactoryService } from './services';
import { CmsrAggregateTracksBrokerService } from './services/cmsr-aggregate-tracks-broker.service';

@Module({
  imports: [
    ExceptionsModule,
    LoggerModule,
    CryptographyFcpModule,
    RabbitmqModule.registerFor('AggregateTracks'),
    RabbitmqModule.registerFor('TracksHigh'),
    RabbitmqModule.registerFor('TracksLegacy'),
  ],
  controllers: [CsmrAggregateTracksController],
  providers: [
    CsmrAggregrateTracksFactoryService,
    CmsrAggregateTracksBrokerService,
  ],
})
export class CsmrAggregateTracksModule {}
