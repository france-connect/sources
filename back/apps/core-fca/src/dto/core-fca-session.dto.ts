/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { CsrfSession } from '@fc/csrf';
import { OidcClientSession } from '@fc/oidc-client';

import { AppSession } from './app-session.dto';

export class CoreFcaSession {
  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => AppSession)
  readonly App?: AppSession;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientSession)
  readonly OidcClient: OidcClientSession;

  @IsObject()
  @ValidateNested()
  @Type(() => CsrfSession)
  @IsOptional()
  readonly Csrf?: CsrfSession;
}
