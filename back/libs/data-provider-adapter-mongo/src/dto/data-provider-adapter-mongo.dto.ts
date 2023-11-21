/* istanbul ignore file */

// Declarative code
import {
  IsBoolean,
  IsEnum,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
} from 'class-validator';

import { DekAlg, KekAlg } from '@fc/cryptography';

export class DataProviderAdapterMongoDTO {
  @IsUUID('4')
  readonly uid: string;

  @IsBoolean()
  readonly active: boolean;

  @IsString()
  readonly title: string;

  @IsString()
  readonly slug: string;

  @IsString()
  @MinLength(32)
  // oidc like
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;

  @IsString()
  @MinLength(32)
  // oidc like
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret: string;

  @IsUrl()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly jwks_uri: string;

  @IsEnum(KekAlg)
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly checktoken_endpoint_auth_signing_alg: KekAlg;

  @IsEnum(KekAlg)
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly checktoken_encrypted_response_alg: KekAlg;

  @IsEnum(DekAlg)
  // openid inspired property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly checktoken_encrypted_response_enc: DekAlg;
}
