/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsArray,
  IsAscii,
  IsBoolean,
  IsJWT,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { IsUrlRequiredTldFromConfig, PartialExcept } from '@fc/common';
import { RnippPivotIdentity } from '@fc/rnipp';

import { IOidcIdentity } from '../interfaces';

export class OidcSession {
  @IsOptional()
  @IsAscii()
  @IsNotEmpty()
  readonly sessionId?: string;

  @IsOptional()
  @IsUUID(4)
  readonly browsingSessionId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly accountId?: string;

  @IsOptional()
  @IsAscii()
  @IsNotEmpty()
  readonly interactionId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly interactionAcr?: string;

  @IsOptional()
  @IsArray()
  readonly amr?: string[];

  @IsOptional()
  @IsBoolean()
  readonly isSilentAuthentication?: boolean;

  // == IdP

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly idpId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly idpName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly idpLabel?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly idpState?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
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
  @IsObject()
  @ValidateNested()
  @Type(() => RnippPivotIdentity)
  readonly rnippIdentity?: RnippPivotIdentity;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly idpAcr?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly idpAccessToken?: string;

  @IsOptional()
  @IsString()
  @IsJWT()
  readonly idpIdToken?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly idpRepresentativeScope?: string[];

  // == SP

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly spScope?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly spId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly spName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly spState?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly spAcr?: string;

  @IsOptional()
  @IsUrlRequiredTldFromConfig()
  readonly spRedirectUri?: string;

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
  readonly spIdentity?: Partial<Omit<IOidcIdentity, 'sub'>>;

  @IsOptional()
  @IsString()
  readonly oidcProviderLogoutForm?: string;

  @IsOptional()
  @IsBoolean()
  readonly isSso?: boolean;

  @IsOptional()
  @IsObject()
  readonly subs?: Record<string, string>;

  @IsOptional()
  @IsString()
  readonly stepRoute?: string;

  @IsOptional()
  @IsString()
  readonly login_hint?: string;
}
