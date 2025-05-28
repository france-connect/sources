import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsString,
} from 'class-validator';

import {
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  PlatformTechnicalKeyEnum,
} from '@fc/service-provider';

export class DefaultServiceProviderLowValueConfig {
  @IsBoolean()
  readonly active: boolean;

  @IsArray()
  readonly claims: string[];

  @IsArray()
  readonly rep_scope: string[];

  @IsBoolean()
  readonly idpFilterExclude: boolean;

  @IsArray()
  readonly idpFilterList: string[];

  @IsNumber()
  @IsIn([1, 2, 3])
  readonly eidas: number;

  @IsEnum(PlatformTechnicalKeyEnum)
  readonly platform: PlatformTechnicalKeyEnum;

  @IsString()
  readonly id_token_encrypted_response_alg: EncryptionAlgorithmEnum;

  @IsString()
  readonly id_token_encrypted_response_enc: EncryptionEncodingEnum;

  @IsString()
  readonly userinfo_encrypted_response_alg: EncryptionAlgorithmEnum;

  @IsString()
  readonly userinfo_encrypted_response_enc: EncryptionEncodingEnum;
}
