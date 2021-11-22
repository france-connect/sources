/* istanbul ignore file */

// Declarative code
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { ClientAuthMethod, ResponseType } from 'openid-client';

export class ClientMetadata {
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_signed_response_alg: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_alg: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_enc: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_signed_response_alg: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_alg: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_enc: string;

  @IsArray()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly redirect_uris: string[];

  @IsArray()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly response_types: ResponseType[];

  @IsArray()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_method: ClientAuthMethod;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_endpoint_auth_method?: ClientAuthMethod;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
