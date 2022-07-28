/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { CryptographyService } from '@fc/cryptography';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { ElasticsearchModule } from '@fc/elasticsearch';
import { ExceptionsModule } from '@fc/exceptions';
import { GeoipMaxmindModule } from '@fc/geoip-maxmind';
import { LoggerModule } from '@fc/logger-legacy';
import { RabbitmqModule } from '@fc/rabbitmq';
import { ScopesModule } from '@fc/scopes';

import { CsmrTracksController } from './controllers';
import {
  CsmrTracksAccountService,
  CsmrTracksElasticService,
  CsmrTracksFormatterService,
  CsmrTracksHighDataService,
  CsmrTracksLegacyDataService,
} from './services';

@Module({
  imports: [
    ExceptionsModule,
    LoggerModule,
    CryptographyFcpModule,
    ScopesModule.forConfig('FcpHigh'),
    ScopesModule.forConfig('FcLegacy'),
    GeoipMaxmindModule,
    ElasticsearchModule.register(),
    RabbitmqModule.registerFor('Tracks'),
    RabbitmqModule.registerFor('AccountHigh'),
    RabbitmqModule.registerFor('AccountLegacy'),
  ],
  controllers: [CsmrTracksController],
  providers: [
    CsmrTracksHighDataService,
    CsmrTracksLegacyDataService,
    CsmrTracksAccountService,
    CsmrTracksElasticService,
    CsmrTracksFormatterService,
    CryptographyService,
  ],
})
export class CsmrTracksModule {}
