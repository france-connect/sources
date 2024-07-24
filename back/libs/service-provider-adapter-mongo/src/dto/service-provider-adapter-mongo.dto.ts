import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// Creates a cyclic dependency
import { IsEqualToConfig, IsUrlRequiredTldFromConfig } from '@fc/common';
import { SUPPORTED_SIG_ALG } from '@fc/cryptography';

import { ServiceProviderAdapterMongoConfig } from './service-provider-adapter-mongo-config.dto';

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
  readonly client_secret: string;

  @IsArray()
  @IsUrlRequiredTldFromConfig({ each: true })
  readonly redirect_uris: string[];

  @IsArray()
  @IsUrlRequiredTldFromConfig({ each: true })
  readonly post_logout_redirect_uris: string[];

  @IsArray()
  @IsString({ each: true })
  readonly scopes: string[];

  @IsArray()
  @IsString({ each: true })
  readonly claims: string[];

  @IsString()
  @IsIn(SUPPORTED_SIG_ALG)
  readonly id_token_signed_response_alg: 'ES256' | 'RS256' | 'HS256';

  @IsString()
  readonly id_token_encrypted_response_alg: string;

  @IsString()
  readonly id_token_encrypted_response_enc: string;

  @IsString()
  readonly userinfo_signed_response_alg: string;

  @IsString()
  readonly userinfo_encrypted_response_alg: string;

  @IsString()
  readonly userinfo_encrypted_response_enc: string;

  @IsOptional()
  @IsUrlRequiredTldFromConfig()
  readonly jwks_uri?: string;

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

  @IsBoolean()
  readonly ssoDisabled: boolean;

  @IsOptional()
  @IsEqualToConfig<ServiceProviderAdapterMongoConfig>(
    'ServiceProviderAdapterMongo',
    'platform',
  )
  @IsString()
  readonly platform?: string;
}
