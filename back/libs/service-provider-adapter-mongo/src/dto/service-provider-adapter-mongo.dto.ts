import {
  IsArray,
  IsBoolean,
  IsIn,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

const SUPPORTED_SIG_ALG = ['ES256', 'RS256', 'HS256'];

export class ServiceProviderAdapterMongoDTO {
  @IsBoolean()
  readonly active: boolean;

  @IsString()
  readonly key: string;

  @IsString() // HSM
  @MinLength(32)
  readonly entityId: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly title: string;

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

  @IsArray()
  @IsString({ each: true })
  readonly scopes: string[];

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

  @IsBoolean()
  idpFilterExclude: boolean;

  @IsArray()
  @IsString({ each: true })
  idpFilterList: string[];

  @IsString()
  @IsIn(['private', 'public'], {
    message: 'The service provider type should be specified',
  })
  readonly type: string;

  @IsBoolean()
  readonly identityConsent: boolean;
}
