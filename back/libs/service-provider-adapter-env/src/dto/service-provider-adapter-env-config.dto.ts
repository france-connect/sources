/* istanbul ignore file */

// Declarative code
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

const SUPPORTED_SIG_ALG = ['ES256', 'RS256', 'HS256'];

export class ServiceProviderAdapterEnvConfig {
  @IsBoolean()
  readonly active: boolean;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;

  @IsString()
  readonly name: string;

  @IsString()
  @MinLength(32)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret: string;

  @IsArray()
  @IsUrl({}, { each: true })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly redirect_uris: string[];

  @IsArray()
  @IsUrl({}, { each: true })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly post_logout_redirect_uris: string[];

  @IsString()
  readonly scope: string;

  @IsString()
  @IsIn(SUPPORTED_SIG_ALG)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_signed_response_alg: 'ES256' | 'RS256' | 'HS256';

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_alg: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_enc: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_signed_response_alg: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_alg: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_enc: string;

  @IsUrl()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly jwks_uri: string;
}
