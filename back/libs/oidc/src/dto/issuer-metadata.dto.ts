/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, IsString, IsUrl } from 'class-validator';

class MtlsEndpointAliases {
  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_endpoint: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly revocation_endpoint: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_endpoint: string;
}

export class IssuerMetadata {
  @IsString()
  readonly issuer: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly authorization_endpoint: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint: string;

  @IsUrl()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly jwks_uri: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_endpoint: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly revocation_endpoint: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_endpoint: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly end_session_endpoint: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly registration_endpoint: string;

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_methods_supported: string[];

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_signing_alg_values_supported: string[];

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_endpoint_auth_methods_supported: string[];

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_endpoint_auth_signing_alg_values_supported: string[];

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly revocation_endpoint_auth_signing_alg_values_supported: string[];

  @IsString()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_signing_alg_values_supported: string[];

  @IsObject()
  @Type(() => MtlsEndpointAliases)
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly mtls_endpoint_aliases: MtlsEndpointAliases;

  /**
   * Wildcard needed to be compatible with `openid-client` internal interface
   */
  [key: string]: unknown;
}
