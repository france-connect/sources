/* istanbul ignore file */

// Declarative code
import { IsEmail, IsOptional } from 'class-validator';

import { OidcClientSession } from '@fc/oidc-client';

export class CoreFcaOidcClientSession extends OidcClientSession {
  @IsOptional()
  @IsEmail()
  // login_hint is an oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly login_hint?: string;
}
