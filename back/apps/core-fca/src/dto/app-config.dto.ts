/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

import { ContentSecurityPolicy } from './content-secury-policy.dto';

export class AppConfig extends AppGenericConfig {
  @IsString()
  readonly defaultIdpId: string;

  @IsString()
  readonly defaultEmailRenater: string;

  @ValidateNested()
  @Type(() => ContentSecurityPolicy)
  readonly contentSecurityPolicy: ContentSecurityPolicy;
}
