import { Type } from 'class-transformer';
import {
  Equals,
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

export class ConfigCreateMessageDtoPayload implements Partial<OidcClientInterface> {
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

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly allowedIdpHints?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly allowedPrompts?: string[];

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
  readonly instanceId: string;

  @IsString()
  readonly versionId: string;

  @IsEnum(PublicationStatusEnum)
  readonly publicationStatus: PublicationStatusEnum;
}

// The deletion only needs to identify the client, it must not validate the
// creation payload: an instance published before a new mandatory attribute was
// added would keep an outdated version data and become impossible to delete.
export class ConfigDeleteMessageDtoPayload implements Partial<OidcClientInterface> {
  @IsString()
  readonly client_id: string;
}

export abstract class ConfigBaseMessageDto implements FSA<ConfigMessageDtoMeta> {
  @IsEnum(ActionTypes)
  readonly type: ActionTypes;

  @IsOptional()
  @IsObject()
  @Type(() => ConfigMessageDtoMeta)
  @ValidateNested()
  readonly meta?: ConfigMessageDtoMeta;
}

export abstract class ConfigMessageDto extends ConfigBaseMessageDto {
  @IsObject()
  @Type(() => ConfigCreateViaMessageDtoPayload)
  @ValidateNested()
  readonly payload: ConfigCreateViaMessageDtoPayload;
}

export class ConfigCreateMessageDto extends ConfigMessageDto {
  @Equals(ActionTypes.CONFIG_CREATE)
  readonly type = ActionTypes.CONFIG_CREATE;
}

export class ConfigUpdateMessageDto extends ConfigMessageDto {
  @Equals(ActionTypes.CONFIG_UPDATE)
  readonly type = ActionTypes.CONFIG_UPDATE;
}

export class ConfigDeleteMessageDto extends ConfigBaseMessageDto {
  @Equals(ActionTypes.CONFIG_DELETE)
  readonly type = ActionTypes.CONFIG_DELETE;

  @IsObject()
  @Type(() => ConfigDeleteMessageDtoPayload)
  @ValidateNested()
  readonly payload: ConfigDeleteMessageDtoPayload;
}

export type ConfigAnyMessageDto = ConfigBaseMessageDto & {
  payload: ConfigCreateViaMessageDtoPayload | ConfigDeleteMessageDtoPayload;
};
