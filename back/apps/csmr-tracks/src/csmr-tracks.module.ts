/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { ElasticsearchModule } from '@fc/elasticsearch';
import { ExceptionsModule } from '@fc/exceptions';
import { LoggerModule } from '@fc/logger';
import { MongooseModule } from '@fc/mongoose';

import { CsmrTracksController } from './controllers';
import { CsmrTracksElasticsearchService, CsmrTracksService } from './services';

@Module({
  imports: [
    ExceptionsModule,
    MongooseModule,
    LoggerModule,
    ElasticsearchModule.register(),
    AccountModule,
    CryptographyFcpModule,
  ],
  controllers: [CsmrTracksController],
  providers: [CsmrTracksService, CsmrTracksElasticsearchService],
})
export class CsmrTracksModule {}
