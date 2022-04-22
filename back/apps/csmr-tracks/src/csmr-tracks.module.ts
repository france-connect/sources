/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module, ModuleMetadata, Type } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { ElasticsearchModule } from '@fc/elasticsearch';
import { ExceptionsModule } from '@fc/exceptions';
import { LoggerModule } from '@fc/logger-legacy';
import { MongooseModule } from '@fc/mongoose';

import { CsmrTracksController } from './controllers';
import { IAppTracksDataService } from './interfaces';
import { CsmrTracksElasticsearchService, CsmrTracksService } from './services';
import { CSMR_TRACKS_DATA } from './tokens';

type InstanceImports = ModuleMetadata['imports'];

@Module({})
export class CsmrTracksModule {
  /**
   * Static constructor to create dynamic module of csmr-tracks
   * @param proxy service used to format logs
   * @param imports list of specific imports required by instance of csmr-tracks
   */
  static withProxy(
    proxy: Type<IAppTracksDataService>,
    imports: InstanceImports = [],
  ): DynamicModule {
    return {
      module: CsmrTracksModule,
      imports: [
        ExceptionsModule,
        MongooseModule,
        LoggerModule,
        ElasticsearchModule.register(),
        AccountModule,
        ...imports,
      ],
      controllers: [CsmrTracksController],
      providers: [
        CsmrTracksService,
        CsmrTracksElasticsearchService,
        { provide: CSMR_TRACKS_DATA, useClass: proxy },
      ],
      exports: [CsmrTracksService],
    };
  }
}
