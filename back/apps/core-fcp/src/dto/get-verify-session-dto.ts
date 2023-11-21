/* istanbul ignore file */

// Declarative file
import { Expose, Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsObject, IsString } from 'class-validator';

import { PartialExcept } from '@fc/common';
import { CoreBaseOidcClientSessionDto } from '@fc/core';
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientRoutes } from '@fc/oidc-client';
import { OidcProviderRoutes } from '@fc/oidc-provider';

import { AppSession } from './app-session.dto';
import { CoreSessionDto } from './core-session.dto';

export class GetVerifyOidcClientSessionDto extends CoreBaseOidcClientSessionDto {
  // Metadata: We MUST restrict the routes we can come from
  @IsString()
  @IsIn([OidcClientRoutes.OIDC_CALLBACK, OidcProviderRoutes.AUTHORIZATION])
  @Expose()
  readonly stepRoute: string;

  // Identity Provider: We MUST have idpId
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpId: string;

  // Identity Provider: We MUST have idpName
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpName: string;

  // Identity Provider: We MUST have idpLabel
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpLabel: string;

  // Identity : We MUST have idpIdentity
  @IsObject()
  @Expose()
  readonly idpIdentity: PartialExcept<IOidcIdentity, 'sub'> | IOidcIdentity;
}

export class GetVerifySessionDto {
  @Expose()
  @Type(() => AppSession)
  readonly App: AppSession;

  @Expose()
  @Type(() => GetVerifyOidcClientSessionDto)
  readonly OidcClient: GetVerifyOidcClientSessionDto;

  @Expose()
  @Type(() => CoreSessionDto)
  readonly Core: CoreSessionDto;
}
