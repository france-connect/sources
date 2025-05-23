import { IsInt, IsNotEmpty, IsString } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class AppConfig extends AppGenericConfig {
  @IsString()
  @IsNotEmpty()
  readonly proConnectIdpId: string;

  @IsInt()
  readonly credentialsBytesLength: number;
}
