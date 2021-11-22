/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { OidcClientSession } from '@fc/oidc-client';

import { AppSession } from './app-session.dto';

export class MockIdentityProviderSession {
  @IsObject()
  @ValidateNested()
  @Type(() => AppSession)
  readonly App: AppSession;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientSession)
  readonly OidcClient: OidcClientSession;
}
