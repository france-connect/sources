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
  readonly authorization_endpoint?: string;

  @IsUrl()
  @IsOptional()
  readonly token_endpoint?: string;

  @IsUrl()
  @IsOptional()
  readonly userinfo_endpoint?: string;

  @IsUrl()
  @IsOptional()
  readonly end_session_endpoint?: string;

  @IsUrl()
  readonly jwks_uri: string;
}

class ClientMetadataDto {
  @IsString()
  readonly client_id: string;

  @IsString()
  @MinLength(32)
  readonly client_secret: string;

  @IsArray()
  @IsString({ each: true })
  readonly response_types: string[];

  @IsString()
  @IsIn(SUPPORTED_SIG_ALG)
  readonly id_token_signed_response_alg: 'ES256' | 'RS256' | 'HS256';

  @IsString()
  @IsOptional()
  readonly id_token_encrypted_response_alg?: string;

  @IsString()
  @IsOptional()
  readonly id_token_encrypted_response_enc?: string;

  @IsString()
  @IsOptional()
  readonly userinfo_signed_response_alg?: string;

  @IsString()
  @IsOptional()
  readonly userinfo_encrypted_response_alg?: string;

  @IsString()
  @IsOptional()
  readonly userinfo_encrypted_response_enc?: string;

  @IsString()
  readonly token_endpoint_auth_method: string;

  @IsString()
  readonly revocation_endpoint_auth_method: string;
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
