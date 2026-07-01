import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { I18nSession } from '@fc/i18n';
import { OidcClientSession } from '@fc/oidc-client';
import { Openid4vpSessionDto } from '@fc/openid4vp';

export class WalletBridgeSession {
  @IsObject()
  @ValidateNested()
  @Type(() => I18nSession)
  readonly I18n: I18nSession;

  @IsObject()
  @ValidateNested()
  @Type(() => Openid4vpSessionDto)
  readonly Openid4vp: Openid4vpSessionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientSession)
  readonly OidcClient: OidcClientSession;
}
