/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { ElasticsearchConfig } from '@fc/elasticsearch';
import { LoggerConfig } from '@fc/logger';
import { MongooseConfig } from '@fc/mongoose';
import { RabbitmqConfig } from '@fc/rabbitmq';

export class CsmrTracksConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly TracksBroker: RabbitmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ElasticsearchConfig)
  readonly Elasticsearch: ElasticsearchConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MongooseConfig)
  readonly Mongoose: MongooseConfig;
}
