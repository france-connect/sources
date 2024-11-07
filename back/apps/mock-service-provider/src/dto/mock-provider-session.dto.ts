/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { OidcClientSession } from '@fc/oidc-client';

import { AppSession } from './app-session.dto';

export class MockServiceProviderSession {
  @IsObject()
  @ValidateNested()
  @Type(() => AppSession)
  @IsOptional()
  readonly App?: AppSession;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientSession)
  @IsOptional()
  readonly OidcClient?: OidcClientSession;
}
