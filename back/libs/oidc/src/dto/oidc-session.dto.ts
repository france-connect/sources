// Stryker disable all
/* istanbul ignore file */

// Declarative code
import {
  IsArray,
  IsAscii,
  IsJWT,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { PartialExcept } from '@fc/common';

import { IOidcIdentity } from '../interfaces';

export class OidcSession {
  @IsOptional()
  @IsAscii()
  @MinLength(1)
  readonly sessionId?: string;

  @IsOptional()
  @IsUUID()
  readonly accountId?: string;

  @IsOptional()
  @IsAscii()
  @MinLength(1)
  readonly interactionId?: string;

  @IsOptional()
  @IsString()
  @MinLength(32)
  @MaxLength(32)
  readonly csrfToken?: string;

  @IsOptional()
  @IsArray()
  readonly amr?: string[];

  // == IdP

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly idpId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly idpName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly idpLabel?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly idpState?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly idpNonce?: string;

  /**
   * @todo #485 This section require a deep type validation
   * It should be done in a session integrity validation ticket
   * that handle errors in case one of the session's member
   * is not valid.
   * @author Brice
   * @date 2021-04-21
   * @ticket #FC-485
   * @sample
   *   @ValidateNested()
   *   @Type (() => IOidcIdentity)
   *   readonly idpIdentity?: IOidcIdentity;
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/485
   */
  @IsOptional()
  @IsObject()
  readonly idpIdentity?: PartialExcept<IOidcIdentity, 'sub'> | IOidcIdentity;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly idpAcr?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly idpAccessToken?: string;

  @IsOptional()
  @IsString()
  @IsJWT()
  readonly idpIdToken?: string;

  // == SP

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly spId?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  readonly spName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly spAcr?: string;

  /**
   * @todo #485 This section require a deep type validation
   * It should be done in a session integrity validation ticket
   * that handle errors in case one of the session's member
   * is not valid.
   * @author Brice
   * @date 2021-04-21
   * @ticket #FC-485
   * @sample
   *   @ValidateNested()
   *   @Type (() => IOidcIdentity)
   *   readonly spIdentity?: IOidcIdentity;
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/485
   */
  @IsOptional()
  @IsObject()
  readonly spIdentity?: PartialExcept<IOidcIdentity, 'sub'>;

  @IsString()
  @IsOptional()
  readonly oidcProviderLogoutForm?: string;
}
