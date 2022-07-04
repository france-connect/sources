/* istanbul ignore file */

// Declarative code
import { IsIn, IsString } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class AppConfig extends AppGenericConfig {
  @IsString()
  @IsIn(['Europe/Paris'])
  readonly timezone: string;
}
