import { IsBoolean } from 'class-validator';

import { AppRmqConfig } from '@fc/app';

export class AppConfig extends AppRmqConfig {
  @IsBoolean()
  readonly updateProxy: boolean;
}
