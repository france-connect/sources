/* istanbul ignore file */

// Declarative code
import { IsString } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class AppConfig extends AppGenericConfig {
  @IsString()
  readonly platform: string;
}
