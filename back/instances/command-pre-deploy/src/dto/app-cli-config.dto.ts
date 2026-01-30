import { IsString } from 'class-validator';

import { AppCliConfig as BaseAppCliConfig } from '@fc/app';

export class AppCliConfig extends BaseAppCliConfig {
  @IsString()
  readonly basePath: string;
}
