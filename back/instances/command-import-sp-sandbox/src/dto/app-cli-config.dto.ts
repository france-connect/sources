import { IsString, IsUrl } from 'class-validator';

import { AppCliConfig as BaseAppCliConfig } from '@fc/app';

export class AppCliConfig extends BaseAppCliConfig {
  @IsString()
  readonly dsCsvPath: string;

  @IsUrl()
  readonly inviteEndpoint: string;

  @IsString()
  readonly testEmail: string;

  @IsString()
  readonly testInstanceId: string;
}
