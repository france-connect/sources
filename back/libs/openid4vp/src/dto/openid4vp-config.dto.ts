import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { KekAlg } from '@fc/cryptography';
import { JwksDto } from '@fc/jwt';

import { X509_CLIENT_ID_SCHEMES } from '../constants';
import {
  Openid4vpClientIdSchemeEnum,
  Openid4vpFormat,
  Openid4vpResponseMode,
  Openid4vpResponseType,
} from '../enums';
import { Formats } from '../interfaces';

export class ClientMetadata {
  @IsString()
  readonly token_endpoint_auth_method: string;

  @IsString()
  readonly authorization_encrypted_response_alg: string;

  @IsString()
  readonly authorization_encrypted_response_enc: string;

  @IsObject()
  readonly formats: Formats;
}

export class Openid4vpX509Config {
  @IsString()
  readonly certificateChainPem: string;

  @IsString()
  readonly privateKeyPem: string;

  @IsEnum(KekAlg)
  readonly alg: KekAlg;
}

export class Openid4vpRequestConfig {
  @IsString()
  readonly presentationId: string;

  @IsString()
  readonly inputDescriptorId: string;

  @IsArray()
  @IsString({ each: true })
  readonly inputFieldPaths: string[];

  @IsString()
  readonly inputFieldPurpose: string;

  @IsBoolean()
  readonly inputFieldIntentToRetain: boolean;

  @IsEnum(Openid4vpFormat)
  readonly format: Openid4vpFormat;

  @IsEnum(Openid4vpResponseType)
  readonly responseType: Openid4vpResponseType;

  @IsEnum(Openid4vpResponseMode)
  readonly responseMode: Openid4vpResponseMode;
}

export class Openid4vpRelayingPartyConfig {
  @IsUrl()
  @ValidateIf(Openid4vpRelayingPartyConfig.shouldValidateClientId)
  readonly clientId: string;

  @IsEnum(Openid4vpClientIdSchemeEnum)
  readonly clientIdScheme: Openid4vpClientIdSchemeEnum;

  @IsUrl()
  readonly responseUri: string;

  @IsUrl()
  readonly redirectUri: string;

  @IsUrl()
  readonly requestUri: string;

  @IsString()
  @IsOptional()
  readonly authorizationRequestScheme?: string;

  @IsNumber()
  @Min(1)
  readonly nonceLength: number;

  @IsNumber()
  @Min(1)
  readonly stateLength: number;

  @IsNumber()
  @Min(1)
  readonly interactionTtl: number;

  @IsNumber()
  @Min(1)
  readonly responseDelay: number;

  @IsNumber()
  @Min(0)
  readonly redirectDelay: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ClientMetadata)
  readonly clientMetadata: ClientMetadata;

  static shouldValidateClientId(config: Openid4vpRelayingPartyConfig) {
    return !X509_CLIENT_ID_SCHEMES.includes(config.clientIdScheme);
  }
}

export class Openid4vpConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => Openid4vpRelayingPartyConfig)
  readonly relayingParty: Openid4vpRelayingPartyConfig;

  @ValidateIf(Openid4vpConfig.shouldValidateX509Config)
  @IsObject()
  @ValidateNested()
  @Type(() => Openid4vpX509Config)
  readonly x509?: Openid4vpX509Config;

  @IsObject()
  @ValidateNested()
  @Type(() => JwksDto)
  readonly jwks: JwksDto;

  @IsArray()
  @Type(() => Openid4vpRequestConfig)
  @ValidateNested({ each: true })
  readonly requests: Openid4vpRequestConfig[];

  static shouldValidateX509Config(config: Openid4vpConfig) {
    return X509_CLIENT_ID_SCHEMES.includes(config.relayingParty.clientIdScheme);
  }
}
