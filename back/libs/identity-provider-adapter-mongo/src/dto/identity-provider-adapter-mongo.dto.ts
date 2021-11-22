/* istanbul ignore file */

// Declarative code
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  NotContains,
  Validate,
} from 'class-validator';

import {
  IFeatureHandlerDatabase,
  IsRegisteredHandler,
} from '@fc/feature-handler';
import { ResponseTypes } from '@fc/oidc';

import { JwksUriValidator } from './jwksuri.validator';

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

  @IsRegisteredHandler()
  readonly featureHandlers: IFeatureHandlerDatabase;

  /**
   * CLIENT METADATA
   */
  @IsNumber()
  readonly eidas: number;

  @IsString()
  readonly clientID: string;

  @IsArray()
  @IsUrl({}, { each: true })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly redirect_uris: string[];

  @IsArray()
  @IsUrl({}, { each: true })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly post_logout_redirect_uris: string[];

  @IsArray()
  @IsIn(Object.values(ResponseTypes), { each: true })
  @IsString({ each: true })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly response_types: ResponseTypes[];

  @IsOptional()
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly revocation_endpoint_auth_method?: string;

  @IsOptional()
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_signed_response_alg?: string;

  @IsOptional()
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_alg?: string;

  @IsOptional()
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_enc?: string;

  @IsOptional()
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_signed_response_alg?: string;

  @IsOptional()
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_alg?: string;

  @IsOptional()
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_enc?: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_method: string;

  @IsString()
  @MinLength(32)
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
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

export class IdentityProviderAdapterMongoDTO extends MetadataIdpAdapterMongoDTO {
  @IsOptional()
  @Validate(JwksUriValidator)
  readonly jwksURL: string | undefined;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly authzURL: string;

  @IsString()
  readonly tokenURL: string;

  @IsString()
  readonly userInfoURL: string;
}
