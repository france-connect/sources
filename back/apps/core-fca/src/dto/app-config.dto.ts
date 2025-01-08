import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

import { AppConfig as AppGenericConfig } from '@fc/app';

import { ContentSecurityPolicy } from './content-secury-policy.dto';
import { SpAuthorizedFqdnsConfig } from './sp-authorized-fqdns-config.dto';

export class AppConfig extends AppGenericConfig {
  @IsString()
  readonly defaultIdpId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpAuthorizedFqdnsConfig)
  readonly spAuthorizedFqdnsConfigs: SpAuthorizedFqdnsConfig[];

  @IsString()
  readonly defaultEmailRenater: string;

  @ValidateNested()
  @Type(() => ContentSecurityPolicy)
  readonly contentSecurityPolicy: ContentSecurityPolicy;
}
