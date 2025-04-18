import { IsBoolean, IsString } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class AppConfig extends AppGenericConfig {
  @IsString()
  readonly platform: string;

  @IsString({ each: true })
  readonly sortedClaims: string[];

  @IsBoolean()
  showExcludedIdp: boolean;
}
