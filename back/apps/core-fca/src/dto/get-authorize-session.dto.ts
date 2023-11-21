/* istanbul ignore file */

// Declarative file
import { Expose, Type } from 'class-transformer';
import { IsJWT, IsNotEmpty, IsObject, IsString } from 'class-validator';

import { PartialExcept } from '@fc/common';
import { CoreBaseOidcClientSessionDto } from '@fc/core';
import { IOidcIdentity, OidcIdentityDto } from '@fc/oidc';

import { AppSession } from './app-session.dto';
import { CoreSessionDto } from './core-session.dto';

/**
 * This DTO validates only an SSO compliant session.
 *
 * It does not match a brand new session or a session that was not intended to be usable as SSO.
 */
export class GetAuthorizeOidcClientSsoSession extends CoreBaseOidcClientSessionDto {
  // Metadata: We MUST have accountId (SSO)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly accountId: string;

  // Identity Provider: We MUST have idpId (SSO)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpId: string;

  // Identity Provider: We MUST have idpName (SSO)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpName: string;

  // Identity Provider: We MUST have idpLabel (SSO)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpLabel: string;

  // Identity Provider: We MUST have idpAcr (SSO)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpAcr: string;

  // Identity Provider: We MUST have an idpToken (SSO)
  @IsString()
  @IsJWT()
  @Expose()
  readonly idpIdToken: string;

  // Identity : We MUST have an idpIdentity (SSO)
  @IsObject()
  @Expose()
  readonly idpIdentity: PartialExcept<IOidcIdentity, 'sub'> | IOidcIdentity;

  // Identity: We MUST have an spIdentity (SSO)
  @IsObject()
  @Expose()
  readonly spIdentity: OidcIdentityDto;
}

export class GetAuthorizeSessionDto {
  @Expose()
  @Type(() => AppSession)
  readonly App: AppSession;

  @Expose()
  @Type(() => GetAuthorizeOidcClientSsoSession)
  readonly OidcClient: GetAuthorizeOidcClientSsoSession;

  @Expose()
  @Type(() => CoreSessionDto)
  readonly Core: CoreSessionDto;
}
