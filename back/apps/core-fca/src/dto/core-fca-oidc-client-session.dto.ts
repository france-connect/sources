/* istanbul ignore file */

// Declarative code
import { IsEmail, IsOptional } from 'class-validator';

import { OidcClientSession } from '@fc/oidc-client';

export class CoreFcaOidcClientSession extends OidcClientSession {
  @IsOptional()
  @IsEmail()
  readonly login_hint?: string;
}
