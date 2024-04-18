/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CryptographyService } from '@fc/cryptography';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { ElasticsearchModule } from '@fc/elasticsearch';
import { ExceptionsModule } from '@fc/exceptions-deprecated';
import { GeoipMaxmindModule } from '@fc/geoip-maxmind';
import { RabbitmqModule } from '@fc/rabbitmq';
import { ScopesModule } from '@fc/scopes';

import { CsmrTracksController } from './controllers';
import {
  TracksFcpHighFormatter,
  TracksFcpLowFormatter,
  TracksLegacyFormatter,
} from './formatters';
import {
  CsmrTracksAccountService,
  CsmrTracksElasticService,
  CsmrTracksFormatterService,
  CsmrTracksGeoService,
  CsmrTracksService,
} from './services';

@Module({
  imports: [
    ExceptionsModule.withoutTracking(),
    AsyncLocalStorageModule,
    CryptographyFcpModule,
    ScopesModule.forConfig('FcpHigh'),
    ScopesModule.forConfig('FcpLow'),
    ScopesModule.forConfig('FcLegacy'),
    GeoipMaxmindModule,
    ElasticsearchModule.register(),
    RabbitmqModule.registerFor('Tracks'),
    RabbitmqModule.registerFor('AccountHigh'),
    RabbitmqModule.registerFor('AccountLegacy'),
  ],
  controllers: [CsmrTracksController],
  providers: [
    TracksFcpHighFormatter,
    TracksFcpLowFormatter,
    TracksLegacyFormatter,
    CsmrTracksGeoService,
    CsmrTracksService,
    CsmrTracksAccountService,
    CsmrTracksElasticService,
    CsmrTracksFormatterService,
    CryptographyService,
  ],
})
export class CsmrTracksModule {}
