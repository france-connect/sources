import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
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
  @IsOptional()
  readonly site?: string[];

  @IsString({ each: true })
  @IsOptional()
  readonly emails?: string[];

  @IsString({ each: true })
  @IsOptional()
  readonly IPServerAddressesAndRanges?: string[];

  @IsEnum(ClientTypeEnum)
  readonly type: ClientTypeEnum;

  @IsString({ each: true })
  readonly scope: string[];

  @IsString({ each: true })
  readonly claims: string[];

  @IsString({ each: true })
  readonly rep_scope: string[];

  @IsBoolean()
  readonly idpFilterExclude: boolean;

  @IsString({ each: true })
  readonly idpFilterList: string[];

  @IsBoolean()
  readonly identityConsent: boolean;

  @IsBoolean()
  readonly ssoDisabled: boolean;

  @IsString({ each: true })
  readonly redirect_uris: string[];

  @IsString({ each: true })
  readonly post_logout_redirect_uris: string[];

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
  @Type(() => ConfigCreateMessageDtoPayload)
  @ValidateNested()
  readonly payload: ConfigCreateMessageDtoPayload;

  @IsObject()
  @Type(() => ConfigMessageDtoMeta)
  @ValidateNested()
  readonly meta: ConfigMessageDtoMeta;
}
