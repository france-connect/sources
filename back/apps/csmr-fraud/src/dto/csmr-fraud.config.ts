/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { LoggerConfig } from '@fc/logger';
import { MailerConfig } from '@fc/mailer';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { AppRmqConfig } from './app-rmq-config.dto';

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
}
