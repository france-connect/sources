import { IsBoolean, IsNotEmpty, IsUrl, ValidateIf } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class AppConfig extends AppGenericConfig {
  @IsBoolean()
  showDevTools: boolean;

  /** Full URL of the mock wallet identity selection page (dev tools only). */
  @ValidateIf((config: AppConfig) => config.showDevTools === true)
  @IsNotEmpty()
  @IsUrl({
    // Class-validator rule name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_protocol: true,
    protocols: ['https', 'http'],
  })
  devToolsMockUrl?: string;
}
