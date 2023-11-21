/* istanbul ignore file */

// Declarative file
import { Expose, Type } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';

import { CoreBaseOidcClientSessionDto, CoreRoutes } from '@fc/core';

import { AppSession } from './app-session.dto';
import { CoreSessionDto } from './core-session.dto';

export class GetRedirectToIdpOidcClientSessionDto extends CoreBaseOidcClientSessionDto {
  // Metadata: We MUST restrict the routes we can come from
  @IsString()
  @IsIn([CoreRoutes.INTERACTION])
  @Expose()
  readonly stepRoute: string;
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
