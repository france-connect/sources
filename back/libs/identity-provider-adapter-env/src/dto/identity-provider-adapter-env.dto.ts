import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { SUPPORTED_SIG_ALG } from '@fc/cryptography';

class IssuerDto {
  @IsString()
  @IsOptional()
  readonly issuer?: string;

  @IsUrl()
  @IsOptional()
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly authorization_endpoint?: string;

  @IsUrl()
  @IsOptional()
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint?: string;

  @IsUrl()
  @IsOptional()
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_endpoint?: string;

  @IsUrl()
  @IsOptional()
  //oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly end_session_endpoint?: string;

  @IsUrl()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly jwks_uri: string;
}

class ClientMetadataDto {
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;

  @IsString()
  @MinLength(32)
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret: string;

  @IsArray()
  @IsString({ each: true })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly response_types: string[];

  @IsString()
  @IsIn(SUPPORTED_SIG_ALG)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_signed_response_alg: 'ES256' | 'RS256' | 'HS256';

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_alg?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_enc?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_signed_response_alg?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_alg?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_enc?: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_method: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly revocation_endpoint_auth_method: string;

  @IsUrl()
  @IsOptional()
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly redirect_uris?: string;

  @IsUrl()
  @IsOptional()
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly post_logout_redirect_uris?: string;
}

export class IdentityProviderAdapterEnvDTO {
  @IsString()
  readonly uid: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly title: string;

  @IsBoolean()
  readonly active: boolean;

  @IsBoolean()
  readonly display: boolean;

  @IsBoolean()
  readonly discovery: boolean;

  @IsUrl()
  @IsOptional()
  readonly discoveryUrl: string | undefined;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ClientMetadataDto)
  readonly client: ClientMetadataDto;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => IssuerDto)
  readonly issuer: IssuerDto;
}
