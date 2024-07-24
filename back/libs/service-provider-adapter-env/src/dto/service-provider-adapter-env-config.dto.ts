/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { SUPPORTED_SIG_ALG } from '@fc/cryptography';

export class ServiceProviderAdapterEnvConfig {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceProvider)
  readonly list: ServiceProvider[];
}

export class ServiceProvider {
  @IsBoolean()
  readonly active: boolean;

  @IsString()
  readonly client_id: string;

  @IsString()
  readonly name: string;

  @IsString()
  @MinLength(32)
  readonly client_secret: string;

  @IsArray()
  @IsUrl(
    {
      protocols: ['https'],
      // Validator.js defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
    },
    { each: true },
  )
  readonly redirect_uris: string[];

  @IsArray()
  @IsUrl(
    {
      protocols: ['https'],
      // Validator.js defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
    },
    { each: true },
  )
  readonly post_logout_redirect_uris: string[];

  @IsString()
  readonly scope: string;

  @IsString()
  @IsIn(SUPPORTED_SIG_ALG)
  readonly id_token_signed_response_alg: 'ES256' | 'RS256' | 'HS256';

  @IsString()
  readonly id_token_encrypted_response_alg: string;

  @IsString()
  readonly id_token_encrypted_response_enc: string;

  @IsOptional()
  @IsString()
  readonly userinfo_signed_response_alg?: string;

  @IsString()
  readonly userinfo_encrypted_response_alg: string;

  @IsString()
  readonly userinfo_encrypted_response_enc: string;

  @IsOptional()
  @IsUrl()
  readonly jwks_uri?: string;
}
