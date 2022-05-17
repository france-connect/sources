/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { ElasticsearchConfig } from '@fc/elasticsearch';
import { GeoipMaxmindConfig } from '@fc/geoip-maxmind';
import { LoggerConfig } from '@fc/logger-legacy';
import { MongooseConfig } from '@fc/mongoose';
import { RabbitmqConfig } from '@fc/rabbitmq';
import { ScopesConfig } from '@fc/scopes';

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
  @Type(() => ScopesConfig)
  readonly Scopes: ScopesConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ElasticsearchConfig)
  readonly Elasticsearch: ElasticsearchConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MongooseConfig)
  readonly Mongoose: MongooseConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => GeoipMaxmindConfig)
  readonly GeoipMaxmind: GeoipMaxmindConfig;
}
