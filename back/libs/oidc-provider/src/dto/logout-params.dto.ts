import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsUrlRequiredTldFromConfig } from '@fc/common';

/**
 * Control parameters on the authentication request.
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1
 */
export class LogoutParamsDto {
  @IsNotEmpty()
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_hint: string;

  @IsUrlRequiredTldFromConfig()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly post_logout_redirect_uri?: string;

  @IsString()
  @IsOptional()
  readonly state?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly logout_hint?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly ui_locales?: string;
}
