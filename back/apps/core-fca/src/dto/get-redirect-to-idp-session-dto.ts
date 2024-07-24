/* istanbul ignore file */

// Declarative file
import { Expose, Type } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';

import { CoreBaseOidcClientSessionDto, CoreRoutes } from '@fc/core';
import { OidcClientRoutes } from '@fc/oidc-client';

import { CoreFcaRoutes } from '../enums/core-fca-routes.enum';
import { AppSession } from './app-session.dto';
import { CoreSessionDto } from './core-session.dto';

export class GetRedirectToIdpOidcClientSessionDto extends CoreBaseOidcClientSessionDto {
  // Metadata: We MUST restrict the routes we can come from
  @IsString()
  @IsIn([
    CoreRoutes.INTERACTION,
    CoreFcaRoutes.INTERACTION_IDENTITY_PROVIDER_SELECTION,
  ])
  @Expose()
  readonly stepRoute: string;
}

export class GetIdentityProviderSelectionOidcClientSessionDto extends CoreBaseOidcClientSessionDto {
  // Metadata: We MUST restrict the routes we can come from
  @IsString()
  @IsIn([CoreRoutes.INTERACTION, OidcClientRoutes.REDIRECT_TO_IDP])
  @Expose()
  readonly stepRoute: string;

  @IsString()
  readonly login_hint: string;
}

export class GetRedirectToIdpSessionDto {
  @Expose()
  @Type(() => AppSession)
  readonly App: AppSession;

  @Expose()
  @Type(() => GetRedirectToIdpOidcClientSessionDto)
  readonly OidcClient: GetRedirectToIdpOidcClientSessionDto;

  @Expose()
  @Type(() => CoreSessionDto)
  readonly Core: CoreSessionDto;
}
