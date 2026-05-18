import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { DatapassConfig } from '@fc/datapass';
import { LoggerConfig } from '@fc/logger';

import { AppCliConfig } from './app-cli-config.dto';
import { WebhooksPartnersConfig } from './webhooks-partners-config.dto';

export class CommandImportDatapassConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppCliConfig)
  readonly App: AppCliConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => DatapassConfig)
  readonly Datapass: DatapassConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => WebhooksPartnersConfig)
  readonly WebhooksPartners: WebhooksPartnersConfig;
}
