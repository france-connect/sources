/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  NotContains,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { IsIncludedInConfig } from '@fc/common';
import {
  IFeatureHandlerDatabase,
  IsRegisteredHandler,
} from '@fc/feature-handler';
import { Amr, ResponseTypes } from '@fc/oidc';

import { JwksUriValidator } from './jwksuri.validator';

export class ModalIdpAdapterMongo {
  @IsBoolean()
  readonly active: boolean;

  @IsString()
  @ValidateIf(({ active }) => active)
  readonly title: string;

  @IsString()
  @ValidateIf(({ active }) => active)
  readonly body: string;

  @IsString()
  @ValidateIf(({ active }) => active)
  readonly continueText: string;

  @ValidateIf(({ active, moreInfoUrl }) => active && moreInfoUrl.length > 0)
  @IsString()
  @IsNotEmpty()
  readonly moreInfoLabel?: string;

  @ValidateIf(({ active, moreInfoLabel }) => active && moreInfoLabel.length > 0)
  @IsUrl()
  readonly moreInfoUrl?: string;
}

export class MetadataIdpAdapterMongoDTO {
  @IsString()
  readonly uid: string;

  @IsUrl()
  @IsOptional()
  readonly url: string;

  @IsString()
  readonly name: string;

  @IsString()
  @NotContains('/')
  readonly image: string;

  @IsString()
  readonly title: string;

  @IsBoolean()
  readonly active: boolean;

  @IsBoolean()
  readonly display: boolean;

  @IsBoolean()
  readonly isBeta: boolean;

  @IsEnum(Amr, { each: true })
  @IsOptional()
  readonly amr?: Amr[];

  @IsRegisteredHandler()
  readonly featureHandlers: IFeatureHandlerDatabase;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ModalIdpAdapterMongo)
  readonly modal?: ModalIdpAdapterMongo;

  /**
   * CLIENT METADATA
   */
  @IsIncludedInConfig('IdentityProviderAdapterMongo', 'allowedAcr')
  readonly allowedAcr: string[];

  @IsString()
  readonly clientID: string;

  @IsArray()
  @IsEnum(ResponseTypes, { each: true })
  readonly response_types: ResponseTypes[];

  @IsOptional()
  @IsString()
  readonly revocation_endpoint_auth_method?: string;

  @IsOptional()
  @IsString()
  readonly userinfo_signed_response_alg?: string;

  @IsOptional()
  @IsString()
  readonly userinfo_encrypted_response_alg?: string;

  @IsOptional()
  @IsString()
  readonly userinfo_encrypted_response_enc?: string;

  @IsOptional()
  @IsString()
  readonly id_token_signed_response_alg?: string;

  @IsOptional()
  @IsString()
  readonly id_token_encrypted_response_alg?: string;

  @IsOptional()
  @IsString()
  readonly id_token_encrypted_response_enc?: string;

  @IsString()
  readonly token_endpoint_auth_method: string;

  @IsString()
  @MinLength(32)
  readonly client_secret: string;

  // issuer metadata
  @IsString()
  @IsOptional()
  readonly endSessionURL: string;

  @IsBoolean()
  readonly discovery: boolean;
}

export class DiscoveryIdpAdapterMongoDTO extends MetadataIdpAdapterMongoDTO {
  @IsUrl()
  readonly discoveryUrl: string;
}

export class NoDiscoveryIdpAdapterMongoDTO extends MetadataIdpAdapterMongoDTO {
  @IsOptional()
  @Validate(JwksUriValidator)
  readonly jwksURL: string | undefined;

  @IsString()
  readonly authzURL: string;

  @IsString()
  readonly tokenURL: string;

  @IsString()
  readonly userInfoURL: string;
}
