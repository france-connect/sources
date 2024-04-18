/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { OidcClientSession } from '@fc/oidc-client';

export class MockServiceProviderSession {
  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientSession)
  @IsOptional()
  readonly OidcClient?: OidcClientSession;
}
