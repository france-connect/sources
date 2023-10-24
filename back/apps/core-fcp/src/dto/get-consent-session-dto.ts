/* istanbul ignore file */

// Declarative file
import { Expose, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { PartialExcept } from '@fc/common';
import { CoreBaseOidcClientSessionDto, CoreRoutes } from '@fc/core';
import { IOidcIdentity, OidcIdentityDto } from '@fc/oidc';
import { RnippPivotIdentity } from '@fc/rnipp';

import { AppSession } from './app-session.dto';
import { CoreSessionDto } from './core-session.dto';

export class GetConsentOidcClientSessionDto extends CoreBaseOidcClientSessionDto {
  // Metadata: We MUST restrict the routes we can come from
  @IsString()
  @IsIn([CoreRoutes.INTERACTION_VERIFY])
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
  // Identity Provider: We MUST have idpAcr

  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpAcr: string;

  // Identity: We MUST keep a partial idpIdentity (`idpIdentity.sub` for traces)
  // Identity: We MAY keep a full idpIdentity (SSO)
  @IsObject()
  @Expose()
  readonly idpIdentity: PartialExcept<IOidcIdentity, 'sub'> | IOidcIdentity;

  // Identity: We MAY keep a rnippIdentity (SSO)
  @IsOptional()
  @IsObject()
  @Expose()
  readonly rnippIdentity?: RnippPivotIdentity;

  // Identity: We MUST have a spIdentity (SSO)
  @IsObject()
  @Expose()
  readonly spIdentity: OidcIdentityDto;
}

export class GetConsentSessionDto {
  @Expose()
  @Type(() => AppSession)
  readonly App: AppSession;

  @Expose()
  @Type(() => GetConsentOidcClientSessionDto)
  readonly OidcClient: GetConsentOidcClientSessionDto;

  @Expose()
  @Type(() => CoreSessionDto)
  readonly Core: CoreSessionDto;
}
