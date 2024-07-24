/* istanbul ignore file */

// Declarative code
import { IsArray, IsBoolean, IsIn, IsNumber, IsString } from 'class-validator';
import { ClientAuthMethod, ResponseType } from 'openid-client';

import { SUPPORTED_SIG_ALG } from '@fc/cryptography';

export class ClientMetadata {
  @IsString()
  readonly client_id: string;

  @IsString()
  readonly client_secret: string;

  @IsString()
  @IsIn(SUPPORTED_SIG_ALG)
  readonly id_token_signed_response_alg: 'ES256' | 'RS256' | 'HS256';

  @IsString()
  readonly id_token_encrypted_response_alg: string;

  @IsString()
  readonly id_token_encrypted_response_enc: string;

  @IsString()
  readonly userinfo_signed_response_alg: string;

  @IsString()
  readonly userinfo_encrypted_response_alg: string;

  @IsString()
  readonly userinfo_encrypted_response_enc: string;

  @IsArray()
  readonly redirect_uris: string[];

  @IsArray()
  readonly response_types: ResponseType[];

  @IsArray()
  readonly post_logout_redirect_uris: string[];

  @IsNumber()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly default_max_age: number;

  @IsBoolean()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly require_auth_time: boolean;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_signing_alg: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_encryption_alg: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_encryption_enc: string;

  @IsString()
  readonly token_endpoint_auth_method: ClientAuthMethod;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_endpoint_auth_method?: ClientAuthMethod;

  @IsString()
  readonly revocation_endpoint_auth_method: ClientAuthMethod;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_signing_alg: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_endpoint_auth_signing_alg: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly revocation_endpoint_auth_signing_alg: string;

  @IsBoolean()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly tls_client_certificate_bound_access_tokens: boolean;

  /**
   * Catch all property to be compatible
   * with `openid-client`'s `ClientMetadata` interface
   */
  [key: string]: unknown;
}
