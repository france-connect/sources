/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { ElasticsearchConfig } from '@fc/elasticsearch';
import { GeoipMaxmindConfig } from '@fc/geoip-maxmind';
import { LoggerConfig } from '@fc/logger';
import { RabbitmqConfig } from '@fc/rabbitmq';
import { ScopesConfig } from '@fc/scopes';

import { IdpMappings } from './idp-mappings.config';

export class CsmrTracksConfig {
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
  @Type(() => RabbitmqConfig)
  readonly TracksBroker: RabbitmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly AccountLegacyBroker: RabbitmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly AccountHighBroker: RabbitmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ScopesConfig)
  readonly ScopesFcLegacy: ScopesConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ScopesConfig)
  readonly ScopesFcpHigh: ScopesConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ScopesConfig)
  readonly ScopesFcpLow: ScopesConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => GeoipMaxmindConfig)
  readonly GeoipMaxmind: GeoipMaxmindConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => IdpMappings)
  readonly IdpMappings: IdpMappings;
}
