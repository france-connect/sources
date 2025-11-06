import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { ElasticsearchConfig } from '@fc/elasticsearch';
import { LoggerConfig } from '@fc/logger';
import { MailerConfig } from '@fc/mailer';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { AppRmqConfig } from './app-rmq-config.dto';
import { IdpMappings } from './idp-mappings.config';

export class CsmrFraudConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppRmqConfig)
  readonly App: AppRmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly FraudBroker: RabbitmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MailerConfig)
  readonly Mailer: MailerConfig;

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
  @Type(() => ElasticsearchConfig)
  readonly Elasticsearch: ElasticsearchConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => IdpMappings)
  readonly IdpMappings: IdpMappings;
}
