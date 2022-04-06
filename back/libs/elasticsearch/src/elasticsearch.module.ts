/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module } from '@nestjs/common';
import { ElasticsearchModule as EsModule } from '@nestjs/elasticsearch';

import { ConfigModule, ConfigService } from '@fc/config';

import { ElasticsearchConfig } from './dto';
import { ClientOptions } from './interfaces';

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
  const { nodes, username, password } =
    config.get<ElasticsearchConfig>('Elasticsearch');
  const options: ClientOptions = {
    nodes,
    auth: {
      username,
      password,
    },
  };
  return options;
}
