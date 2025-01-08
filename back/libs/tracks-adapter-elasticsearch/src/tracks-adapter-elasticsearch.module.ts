import { DynamicModule, Module, Type } from '@nestjs/common';

import { ElasticsearchModule } from '@fc/elasticsearch';
import { GeoipMaxmindModule } from '@fc/geoip-maxmind';

import {
  TracksFormatterAbstract,
  TracksFormatterOutputAbstract,
} from './interfaces';
import {
  ElasticTracksService,
  GeoFormatterService,
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
      imports: [
        GeoipMaxmindModule,
        ElasticsearchModule.register(),
        ...(options?.imports || []),
      ],
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
        GeoFormatterService,
        TracksAdapterElasticsearchService,
      ],
      exports: [TracksAdapterElasticsearchService, GeoFormatterService],
    };
  }
}
