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
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;

  @IsString()
  readonly name: string;

  @IsString()
  @MinLength(32)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly post_logout_redirect_uris: string[];

  @IsString()
  readonly scope: string;

  @IsString()
  @IsIn(SUPPORTED_SIG_ALG)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_signed_response_alg: 'ES256' | 'RS256' | 'HS256';

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_alg: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_enc: string;

  @IsOptional()
  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_signed_response_alg?: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_alg: string;

  @IsString()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_enc: string;

  @IsOptional()
  @IsUrl()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly jwks_uri?: string;
}
