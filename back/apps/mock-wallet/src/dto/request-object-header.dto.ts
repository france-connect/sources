import { Equals } from 'class-validator';

import { IsIncludedInConfig } from '@fc/common';

import { AppConfig } from './app-config.dto';

export const JAR_TYP = 'oauth-authz-req+jwt';

export class RequestObjectHeaderDto {
  @Equals(JAR_TYP)
  readonly typ: string;

  @IsIncludedInConfig<AppConfig>('App', 'allowedAlgs')
  readonly alg: string;
}
