import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

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

  @IsUrl()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly post_logout_redirect_uri: string;

  @IsNotEmpty()
  @IsString()
  readonly state: string;
}
