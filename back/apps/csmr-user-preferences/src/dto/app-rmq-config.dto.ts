import { IsUUID, MinLength } from 'class-validator';

import { AppRmqConfig as BaseAppRmqConfig } from '@fc/app';

export class AppRmqConfig extends BaseAppRmqConfig {
  @IsUUID(4)
  @MinLength(1)
  readonly aidantsConnectUid: string;
}
