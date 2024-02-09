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
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientRoutes } from '@fc/oidc-client';
import { OidcProviderRoutes } from '@fc/oidc-provider';
import { RnippPivotIdentity } from '@fc/rnipp';

import { AppSession } from './app-session.dto';
import { CoreSessionDto } from './core-session.dto';

export class GetInteractionOidcClientSessionDto extends CoreBaseOidcClientSessionDto {
  // Metadata: We MAY have an accountId (SSO)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly accountId?: string;

  // Metadata: We MUST restrict the routes we can come from
  @IsString()
  @IsIn([
    OidcProviderRoutes.AUTHORIZATION, // Standard cinematic
    CoreRoutes.INTERACTION, // Refresh
    OidcClientRoutes.OIDC_CALLBACK, // Back on error
    CoreRoutes.INTERACTION_VERIFY, // Back on error
    CoreRoutes.INTERACTION_CONSENT, // Back on error
    OidcClientRoutes.REDIRECT_TO_IDP, // Browser back button
  ])
  @Expose()
  readonly stepRoute: string;

  // Identity: We MAY have an idpIdentity (SSO)
  @IsOptional()
  @IsObject()
  @Expose()
  readonly idpIdentity?: PartialExcept<IOidcIdentity, 'sub'> | IOidcIdentity;

  // Identity: We MAY have an rnippIdentity (SSO)
  @IsOptional()
  @IsObject()
  @Expose()
  readonly rnippIdentity?: RnippPivotIdentity;
}

export class GetInteractionSessionDto {
  @Expose()
  @Type(() => AppSession)
  readonly App: AppSession;

  @Expose()
  @Type(() => GetInteractionOidcClientSessionDto)
  readonly OidcClient: GetInteractionOidcClientSessionDto;

  @Expose()
  @Type(() => CoreSessionDto)
  readonly Core: CoreSessionDto;
}
