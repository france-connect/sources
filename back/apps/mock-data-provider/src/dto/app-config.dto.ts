/* istanbul ignore file */

// Declarative code
import { IsNotEmpty, IsString } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

export class AppConfig extends AppGenericConfig {
  @IsString()
  @IsNotEmpty()
  readonly apiAuthSecret: string;
}
