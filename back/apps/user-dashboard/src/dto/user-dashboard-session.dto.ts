/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { CsrfSession } from '@fc/csrf';
import { I18nSession } from '@fc/i18n';
import { OidcClientSession } from '@fc/oidc-client';

export class UserDashboardSession {
  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientSession)
  @IsOptional()
  readonly OidcClient?: OidcClientSession;

  @IsObject()
  @ValidateNested()
  @Type(() => CsrfSession)
  @IsOptional()
  readonly Csrf?: CsrfSession;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nSession)
  readonly I18n: I18nSession;
}
