import { IsArray, IsBoolean, IsString, MinLength } from 'class-validator';

export class GetDiscoveryDto {
  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly acr_values_supported: string[];

  @IsString()
  @MinLength(1)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly authorization_endpoint: string;

  @IsBoolean()
  readonly claims_parameter_supported: boolean;

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly claims_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly code_challenge_methods_supported: string[];

  @IsString()
  @MinLength(1)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly end_session_endpoint: string;

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly grant_types_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_signing_alg_values_supported: string[];

  @IsString()
  @MinLength(1)
  readonly issuer: string;

  @IsString()
  @MinLength(1)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly jwks_uri: string;

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly response_modes_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly response_types_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly scopes_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly subject_types_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_methods_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_signing_alg_values_supported: string[];

  @IsString()
  @MinLength(1)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint: string;

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_signing_alg_values_supported: string[];

  @IsBoolean()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_parameter_supported: boolean;

  @IsBoolean()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_uri_parameter_supported: boolean;

  @IsBoolean()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly require_request_uri_registration: boolean;

  @IsString()
  @MinLength(1)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_endpoint: string;

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_signing_alg_values_supported: string[];

  @IsString()
  @MinLength(1)
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly revocation_endpoint: string;

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly revocation_endpoint_auth_methods_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly revocation_endpoint_auth_signing_alg_values_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly claim_types_supported: string[];
}

export class GetDiscoveryWithEncryptionDto extends GetDiscoveryDto {
  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encryption_alg_values_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encryption_enc_values_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encryption_alg_values_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encryption_enc_values_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_encryption_alg_values_supported: string[];

  @IsString({ each: true })
  @IsArray()
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_encryption_enc_values_supported: string[];
}
