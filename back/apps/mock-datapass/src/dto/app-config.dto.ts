import { IsString, IsUrl } from 'class-validator';

import { AppConfig as BaseAppConfig } from '@fc/app';

export class AppConfig extends BaseAppConfig {
  @IsUrl()
  readonly webhookUrl: string;

  @IsString()
  readonly payloadsPath: string;
}
