/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { OidcClientSession } from '@fc/oidc-client';

export class UserDashboardSession {
  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientSession)
  readonly OidcClient: OidcClientSession;
}
