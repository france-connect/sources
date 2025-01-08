import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class AppConfig extends AppGenericConfig {
  @IsString()
  @IsIn(['Europe/Paris'])
  readonly timezone: string;

  @IsString()
  @IsNotEmpty()
  readonly idpId: string;
}
