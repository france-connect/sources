import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { JSONWebKeySet } from 'jose';

import { IsIncludedInConfig } from '@fc/common';
import { DekAlg, KekAlg } from '@fc/cryptography/enums';
import { DcqlQueryInterface, IsDcqlQuery } from '@fc/dcql';
import { JwksDto } from '@fc/jwt';
// Deep import to avoid @fc/session inclusion (TemplateMethod missing service issue)
import {
  Openid4vpClientIdSchemeEnum,
  Openid4vpResponseMode,
  Openid4vpResponseType,
} from '@fc/openid4vp/enums';
import { Formats } from '@fc/openid4vp/interfaces';
import { IsClientId } from '@fc/openid4vp/validators/is-client-id.validator';

import { ClientMetadata, RequestObjectPayload } from '../interfaces';
import { AppConfig } from './app-config.dto';

export class ClientMetadataDto implements ClientMetadata {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => JwksDto)
  readonly jwks: JSONWebKeySet;

  @IsObject()
  readonly vp_formats_supported: Formats;

  @IsEnum(KekAlg)
  readonly authorization_encrypted_response_alg: KekAlg;

  @IsEnum(DekAlg)
  readonly authorization_encrypted_response_enc: DekAlg;
}

export class RequestObjectPayloadDto implements RequestObjectPayload {
  @IsEnum(Openid4vpResponseType)
  readonly response_type: string;

  @IsEnum(Openid4vpResponseMode)
  @IsIncludedInConfig<AppConfig>('App', 'allowedResponseModes')
  readonly response_mode: Openid4vpResponseMode;

  @IsString()
  @IsNotEmpty()
  readonly nonce: string;

  @IsEnum(Openid4vpClientIdSchemeEnum)
  readonly client_id_scheme: Openid4vpClientIdSchemeEnum;

  @IsClientId()
  readonly client_id: string;

  @IsUrl({
    require_protocol: true,
    protocols: ['https'],
  })
  readonly response_uri: string;

  @IsInt()
  readonly exp: number;

  @IsInt()
  @IsOptional()
  readonly nbf?: number;

  @IsInt()
  @IsOptional()
  readonly iat?: number;

  @IsString()
  @IsOptional()
  readonly state?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ClientMetadataDto)
  readonly client_metadata?: ClientMetadataDto;

  @IsObject()
  @IsDcqlQuery()
  readonly dcql_query: DcqlQueryInterface;
}
