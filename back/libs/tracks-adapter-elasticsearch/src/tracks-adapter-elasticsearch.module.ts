import { DynamicModule, Module, Type } from '@nestjs/common';

import { ElasticsearchModule } from '@fc/elasticsearch';

import {
  TracksFormatterAbstract,
  TracksFormatterOutputAbstract,
} from './interfaces';
import {
  ElasticTracksService,
  TracksAdapterElasticsearchService,
  TracksFormatterService,
} from './services';

interface TracksAdapterElasticsearchModuleOptions {
  imports?: DynamicModule[];
}

@Module({})
export class TracksAdapterElasticsearchModule {
  static forRoot<TOutput extends TracksFormatterOutputAbstract>(
    formatterFcpHigh: Type<TracksFormatterAbstract<TOutput>>,
    formatterFcpLow: Type<TracksFormatterAbstract<TOutput>>,
    formatterLegacy: Type<TracksFormatterAbstract<TOutput>>,
    options?: TracksAdapterElasticsearchModuleOptions,
  ): DynamicModule {
    return {
      module: TracksAdapterElasticsearchModule,
      imports: [ElasticsearchModule.register(), ...(options?.imports || [])],
      providers: [
        {
          provide: 'TracksFcpHighFormatter',
          useClass: formatterFcpHigh,
        },
        {
          provide: 'TracksFcpLowFormatter',
          useClass: formatterFcpLow,
        },
        {
          provide: 'TracksLegacyFormatter',
          useClass: formatterLegacy,
        },
        TracksFormatterService,
        ElasticTracksService,
        TracksAdapterElasticsearchService,
      ],
      exports: [TracksAdapterElasticsearchService],
    };
  }
}
