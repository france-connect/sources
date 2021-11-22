/* istanbul ignore file */

// Declarative code
import { ClientOptions } from '@elastic/elasticsearch';

import { DynamicModule, Module } from '@nestjs/common';
import { ElasticsearchModule as EsModule } from '@nestjs/elasticsearch';

import { ConfigModule, ConfigService } from '@fc/config';

import { ElasticsearchConfig } from './dto';

export { ElasticsearchService } from '@nestjs/elasticsearch';

@Module({})
export class ElasticsearchModule {
  static register(): DynamicModule {
    return EsModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => useFactory(config),
    });
  }
}

function useFactory(config: ConfigService) {
  const es: ElasticsearchConfig =
    config.get<ElasticsearchConfig>('Elasticsearch');
  const options: ClientOptions = {
    node: `${es.protocol}://${es.host}:${es.port}`,
  };
  return options;
}
