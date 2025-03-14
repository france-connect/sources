import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsString,
} from 'class-validator';

import {
  ClientTypeEnum,
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  PlatformTechnicalKeyEnum,
  SignatureAlgorithmEnum,
} from '@fc/service-provider';

export class DefaultServiceProviderLowValueConfig {
  @IsArray()
  readonly scope: string[];

  @IsArray()
  readonly emails: string[];

  @IsArray()
  readonly claims: string[];

  @IsArray()
  readonly rep_scope: string[];

  @IsBoolean()
  readonly idpFilterExclude: boolean;

  @IsArray()
  readonly idpFilterList: string[];

  @IsBoolean()
  readonly active: boolean;

  @IsNumber()
  @IsIn([1, 2, 3])
  readonly eidas: number;

  @IsEnum(ClientTypeEnum)
  readonly type: ClientTypeEnum;

  @IsEnum(PlatformTechnicalKeyEnum)
  readonly platform: PlatformTechnicalKeyEnum;

  @IsBoolean()
  readonly identityConsent: boolean;

  @IsString()
  readonly id_token_encrypted_response_alg: EncryptionAlgorithmEnum;

  @IsString()
  readonly id_token_encrypted_response_enc: EncryptionEncodingEnum;

  @IsString()
  readonly userinfo_signed_response_alg: SignatureAlgorithmEnum;

  @IsString()
  readonly userinfo_encrypted_response_alg: EncryptionAlgorithmEnum;

  @IsString()
  readonly userinfo_encrypted_response_enc: EncryptionEncodingEnum;
}
