import { Expose, Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import { CoreBaseOidcClientSessionDto } from '@fc/core';
import { DeviceSession } from '@fc/device';
import { I18nSession } from '@fc/i18n';
import { OidcClientRoutes } from '@fc/oidc-client';

import { AppSession } from './app-session.dto';
import { CoreSession } from './core-session.dto';

export class GetOidcCallbackOidcClientSessionDto extends CoreBaseOidcClientSessionDto {
  // Metadata: We MUST restrict the routes we can come from
  @IsString()
  @IsIn([OidcClientRoutes.REDIRECT_TO_IDP])
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

  // Identity Provider: We MUST have idpState
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpState: string;

  // Identity Provider: We MUST have idpNonce
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpNonce: string;
}

export class GetOidcCallbackSessionDto {
  @Expose()
  @Type(() => AppSession)
  readonly App: AppSession;

  @Expose()
  @Type(() => GetOidcCallbackOidcClientSessionDto)
  readonly OidcClient: GetOidcCallbackOidcClientSessionDto;

  @Expose()
  @Type(() => CoreSession)
  readonly Core: CoreSession;

  @Expose()
  @Type(() => I18nSession)
  readonly I18n: I18nSession;

  @Expose()
  @Type(() => DeviceSession)
  readonly Device: DeviceSession;
}
