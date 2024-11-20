/* istanbul ignore file */

// Declarative code

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CsmrAccountClientModule } from '@fc/csmr-account-client';
import { TracksOutputInterface } from '@fc/csmr-tracks-client';
import { ExceptionsModule, FcRmqExceptionFilter } from '@fc/exceptions';
import { RabbitmqModule } from '@fc/rabbitmq';
import { ScopesModule } from '@fc/scopes';
import { TracksAdapterElasticsearchModule } from '@fc/tracks-adapter-elasticsearch';

import { CsmrTracksController } from './controllers';
import {
  TracksFcpHighFormatter,
  TracksFcpLowFormatter,
  TracksLegacyFormatter,
} from './formatters';
import { CsmrTracksService } from './services';

@Module({
  imports: [
    ExceptionsModule,
    AsyncLocalStorageModule,
    TracksAdapterElasticsearchModule.forRoot<TracksOutputInterface>(
      TracksFcpHighFormatter,
      TracksFcpLowFormatter,
      TracksLegacyFormatter,
      {
        imports: [
          ScopesModule.forConfig('FcpHigh'),
          ScopesModule.forConfig('FcpLow'),
          ScopesModule.forConfig('FcLegacy'),
        ],
      },
    ),
    RabbitmqModule.registerFor('Tracks'),
    CsmrAccountClientModule,
  ],
  controllers: [CsmrTracksController],
  providers: [
    CsmrTracksService,
    FcRmqExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: FcRmqExceptionFilter,
    },
  ],
})
export class CsmrTracksModule {}
