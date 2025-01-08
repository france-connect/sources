import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CsmrAccountClientModule } from '@fc/csmr-account-client';
import { ExceptionsModule, FcRmqExceptionFilter } from '@fc/exceptions';
import { MailerModule } from '@fc/mailer';
import { RabbitmqModule } from '@fc/rabbitmq';
import { TracksAdapterElasticsearchModule } from '@fc/tracks-adapter-elasticsearch';

import { CsmrFraudController } from './controllers';
import {
  TracksFcpHighFormatter,
  TracksFcpLowFormatter,
  TracksLegacyFormatter,
} from './formatters';
import { TracksFormatterOutputInterface } from './interfaces';
import {
  CsmrFraudDataService,
  CsmrFraudSupportService,
  CsmrFraudTracksService,
} from './services';

@Module({
  imports: [
    RabbitmqModule.registerFor('Fraud'),
    MailerModule,
    AsyncLocalStorageModule,
    ExceptionsModule,
    TracksAdapterElasticsearchModule.forRoot<TracksFormatterOutputInterface>(
      TracksFcpHighFormatter,
      TracksFcpLowFormatter,
      TracksLegacyFormatter,
    ),
    CsmrAccountClientModule,
  ],
  controllers: [CsmrFraudController],
  providers: [
    CsmrFraudSupportService,
    CsmrFraudDataService,
    CsmrFraudTracksService,
    FcRmqExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: FcRmqExceptionFilter,
    },
  ],
})
export class CsmrFraudModule {}
