import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
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
import { JwksDto } from '@fc/jwt';
// Deep import to avoid @fc/session inclusion (TemplateMethod missing service issue)
import {
  Openid4vpClientIdSchemeEnum,
  Openid4vpResponseMode,
  Openid4vpResponseType,
} from '@fc/openid4vp/enums';
import { Formats } from '@fc/openid4vp/interfaces';
import { IsClientId } from '@fc/openid4vp/validators/is-client-id.validator';

import {
  ClientMetadata,
  InputDescriptor,
  PresentationDefinition,
  RequestObjectPayload,
} from '../interfaces';
import { AppConfig } from './app-config.dto';

class InputDescriptorFieldDto {
  @IsArray()
  @IsString({ each: true })
  readonly path: string[];
}

class InputDescriptorConstraintsDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InputDescriptorFieldDto)
  readonly fields?: InputDescriptorFieldDto[];
}

class InputDescriptorDto implements InputDescriptor {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => InputDescriptorConstraintsDto)
  readonly constraints: InputDescriptorConstraintsDto;
}

class PresentationDefinitionDto implements PresentationDefinition {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InputDescriptorDto)
  readonly input_descriptors: InputDescriptorDto[];
}

export class ClientMetadataDto implements ClientMetadata {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => JwksDto)
  readonly jwks: JSONWebKeySet;

  @IsObject()
  readonly vp_formats: Formats;

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
    // Class-validator rule name
    // eslint-disable-next-line @typescript-eslint/naming-convention
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
  @ValidateNested()
  @Type(() => PresentationDefinitionDto)
  readonly presentation_definition: PresentationDefinitionDto;
}
