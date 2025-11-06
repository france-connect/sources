import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { PublicationStatusEnum } from '@entities/typeorm';

import { FSA, FSAMeta } from '@fc/common';
import {
  ClientTypeEnum,
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  OidcClientInterface,
  PlatformTechnicalKeyEnum,
  SignatureAlgorithmEnum,
} from '@fc/service-provider';

import { ActionTypes } from '../enums';

export class ConfigCreateMessageDtoPayload
  implements Partial<OidcClientInterface>
{
  @IsString()
  readonly client_id: string;

  @IsString()
  readonly client_secret: string;

  @IsBoolean()
  readonly active: boolean;

  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly site?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly emails?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly IPServerAddressesAndRanges?: string[];

  @IsEnum(ClientTypeEnum)
  readonly type: ClientTypeEnum;

  @IsString({ each: true })
  @IsArray()
  readonly scope: string[];

  @IsString({ each: true })
  @IsArray()
  readonly claims: string[];

  @IsString({ each: true })
  @IsArray()
  readonly rep_scope: string[];

  @IsBoolean()
  readonly idpFilterExclude: boolean;

  @IsString({ each: true })
  @IsArray()
  readonly idpFilterList: string[];

  @IsBoolean()
  readonly identityConsent: boolean;

  @IsString({ each: true })
  @IsArray()
  readonly redirect_uris: string[];

  @IsString({ each: true })
  @IsArray()
  readonly post_logout_redirect_uris: string[];

  @IsOptional()
  @IsString()
  readonly sector_identifier_uri?: string;

  @IsEnum(SignatureAlgorithmEnum)
  readonly id_token_signed_response_alg: SignatureAlgorithmEnum;

  @IsEnum(SignatureAlgorithmEnum)
  readonly userinfo_signed_response_alg: SignatureAlgorithmEnum;

  @IsEnum(EncryptionEncodingEnum)
  readonly id_token_encrypted_response_enc: EncryptionEncodingEnum;

  @IsEnum(EncryptionEncodingEnum)
  readonly userinfo_encrypted_response_enc: EncryptionEncodingEnum;

  @IsEnum(EncryptionAlgorithmEnum)
  readonly id_token_encrypted_response_alg: EncryptionAlgorithmEnum;

  @IsEnum(EncryptionAlgorithmEnum)
  readonly userinfo_encrypted_response_alg: EncryptionAlgorithmEnum;

  @IsString()
  @IsOptional()
  readonly entityId?: string;

  @IsString()
  @IsOptional()
  readonly signupId?: string;

  @IsEnum(PlatformTechnicalKeyEnum)
  @IsOptional()
  readonly platform?: PlatformTechnicalKeyEnum;

  @IsNumber()
  @IsOptional()
  readonly eidas?: number;

  @IsString()
  @IsOptional()
  readonly environment?: string;
}

export class ConfigCreateViaMessageDtoPayload extends ConfigCreateMessageDtoPayload {
  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  createdVia?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}

export class ConfigMessageDtoMeta implements FSAMeta {
  [key: string]: unknown;

  @IsString()
  readonly versionId: string;

  @IsString()
  readonly instanceId: string;

  @IsEnum(PublicationStatusEnum)
  readonly publicationStatus: PublicationStatusEnum;
}

export class ConfigMessageDto implements FSA<ConfigMessageDtoMeta> {
  @IsEnum(ActionTypes)
  readonly type: ActionTypes;

  @IsObject()
  @Type(() => ConfigCreateViaMessageDtoPayload)
  @ValidateNested()
  readonly payload: ConfigCreateViaMessageDtoPayload;

  @IsOptional()
  @IsObject()
  @Type(() => ConfigMessageDtoMeta)
  @ValidateNested()
  readonly meta?: ConfigMessageDtoMeta;
}
