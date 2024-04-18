/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { EidasClientSession } from '@fc/eidas-client';
import { EidasProviderSession } from '@fc/eidas-provider';
import { OidcClientSession } from '@fc/oidc-client';

export class EidasBridgeSession {
  @IsObject()
  @ValidateNested()
  @Type(() => EidasProviderSession)
  @IsOptional()
  readonly EidasProvider?: EidasProviderSession;

  @IsObject()
  @ValidateNested()
  @Type(() => EidasClientSession)
  @IsOptional()
  readonly EidasClient?: EidasClientSession;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientSession)
  @IsOptional()
  readonly OidcClient?: OidcClientSession;
}
