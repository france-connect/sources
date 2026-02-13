import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppCliConfig } from '@fc/app';
import { ElasticControlConfig, ElasticsearchConfig } from '@fc/elasticsearch';
import { LoggerConfig } from '@fc/logger';

export class CommandElasticConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppCliConfig)
  readonly App: AppCliConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ElasticsearchConfig)
  readonly Elasticsearch: ElasticsearchConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ElasticControlConfig)
  readonly ElasticControl: ElasticControlConfig;
}
