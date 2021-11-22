/* istanbul ignore file */

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  AdapterConstructor,
  AllClientMetadata,
  AsymmetricSigningAlgorithm,
  CanBePromise,
  ClientAuthMethod,
  EncryptionAlgValues,
  EncryptionEncValues,
  ErrorOut,
  JWK,
  KoaContextWithOIDC,
  PKCEMethods,
  ResponseType,
  SigningAlgorithm,
  SigningAlgorithmWithNone,
  SubjectTypes,
  SymmetricSigningAlgorithm,
  TTLFunction,
} from 'oidc-provider';

import { OidcProviderPrompt, OidcProviderRoutes } from '../enums';

/**
 * Since oidc-provider does not expose some callbacks signatures
 * we generate them with a little precision than any
 * ( through we need any for other unexposed types :'( )
 */
export type LogoutSourceCallback = (
  ctx: KoaContextWithOIDC,
  form: string,
) => CanBePromise<void>;
export type PostLogoutSuccessSourceCallback = (
  ctx: KoaContextWithOIDC,
) => CanBePromise<void>;
export type ClientBasedCORSCallback = (
  ctx: KoaContextWithOIDC,
  origin: string,
  client: any,
) => boolean;
export type InteractionUrlCallback = (
  ctx: KoaContextWithOIDC,
  interaction: unknown,
) => CanBePromise<string>;
export type FindAccountCallback = (
  ctx: KoaContextWithOIDC,
  sub: string,
  token?: any,
) => CanBePromise<any>;
export type PairwiseIdentifierCallbacK = (
  ctx: KoaContextWithOIDC,
  accountId: string,
  client: any,
) => CanBePromise<string>;
export type RenderErrorCallback = (
  ctx: KoaContextWithOIDC,
  out: ErrorOut,
  error: any | Error,
) => CanBePromise<void>;

export class Routes {
  @IsEnum(OidcProviderRoutes)
  readonly authorization: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly check_session: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly code_verification: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly device_authorization: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly end_session: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  readonly introspection: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  readonly jwks: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly pushed_authorization_request: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  readonly registration: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  readonly revocation: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  readonly token: OidcProviderRoutes;

  @IsEnum(OidcProviderRoutes)
  readonly userinfo: OidcProviderRoutes;
}

type SameSite = 'strict' | 'lax' | 'none';

class CookiesOptions {
  @IsString()
  readonly sameSite: SameSite;

  @IsBoolean()
  readonly signed: boolean;

  @IsString()
  readonly path: string;
}

class Cookies {
  @IsArray()
  @IsString({ each: true })
  readonly keys: string[];

  @ValidateNested()
  @Type(() => CookiesOptions)
  readonly long: CookiesOptions;

  @ValidateNested()
  @Type(() => CookiesOptions)
  readonly short: CookiesOptions;
}

class FeatureSetting {
  @IsBoolean()
  readonly enabled: boolean;
}

class LogoutSourceFeatureSetting extends FeatureSetting {
  /**
   * `logoutSource` is a function.
   * This is not something that should live in a DTO.
   * Although this is the way `oidc-provider` library offers
   * to implement our logout service
   * @see https://github.com/panva/node-oidc-provider/blob/v6.x/docs/README.md#featuresrpinitiatedlogout
   *
   * This property is optional because it is injected by the module
   * rather than by real configuration.
   */
  @IsOptional()
  readonly logoutSource?: LogoutSourceCallback;

  /**
   * `postLogoutSuccessSource` is a function.
   * This is not something that should live in a DTO.
   * Although this is the way `oidc-provider` library offers
   * to implement our logout service
   * @see https://github.com/panva/node-oidc-provider/blob/v6.x/docs/README.md#featuresrpinitiatedlogout
   *
   * This property is optional because it is injected by the module
   * rather than by real configuration.
   */
  @IsOptional()
  readonly postLogoutSuccessSource?: PostLogoutSuccessSourceCallback;
}

class Features {
  @ValidateNested()
  @Type(() => FeatureSetting)
  /** optional because this option doesn't exist in agent connect */
  readonly revocation?: FeatureSetting;

  @ValidateNested()
  @Type(() => FeatureSetting)
  readonly devInteractions: FeatureSetting;

  @ValidateNested()
  @Type(() => FeatureSetting)
  readonly encryption: FeatureSetting;

  @ValidateNested()
  @Type(() => FeatureSetting)
  readonly backchannelLogout: FeatureSetting;

  @ValidateNested()
  @Type(() => FeatureSetting)
  readonly jwtUserinfo: FeatureSetting;

  @IsOptional()
  @ValidateNested()
  @Type(() => FeatureSetting)
  readonly claimsParameter?: FeatureSetting;

  @IsOptional()
  @ValidateNested()
  @Type(() => LogoutSourceFeatureSetting)
  /**
   * @see https://github.com/panva/node-oidc-provider/blob/v6.x/docs/README.md#featuresrpinitiatedlogout
   */
  readonly rpInitiatedLogout?: LogoutSourceFeatureSetting;
}

class Ttl {
  @IsNumber()
  readonly AccessToken: TTLFunction<unknown> | number;

  @IsNumber()
  readonly AuthorizationCode: TTLFunction<unknown> | number;

  @IsNumber()
  readonly IdToken: TTLFunction<unknown> | number;

  @IsNumber()
  readonly Interaction: TTLFunction<unknown> | number;

  @IsNumber()
  readonly Session: TTLFunction<unknown> | number;

  [key: string]: unknown;
}

class EnabledJWA {
  @IsArray()
  @IsString({ each: true })
  authorizationEncryptionAlgValues: EncryptionAlgValues[];

  @IsArray()
  @IsString({ each: true })
  authorizationEncryptionEncValues: EncryptionEncValues[];

  @IsArray()
  @IsString({ each: true })
  authorizationSigningAlgValues: (
    | AsymmetricSigningAlgorithm
    | SymmetricSigningAlgorithm
  )[];

  @IsArray()
  @IsString({ each: true })
  dPoPSigningAlgValues: AsymmetricSigningAlgorithm[];

  @IsArray()
  @IsString({ each: true })
  idTokenEncryptionAlgValues: EncryptionAlgValues[];

  @IsArray()
  @IsString({ each: true })
  idTokenEncryptionEncValues: EncryptionEncValues[];

  @IsArray()
  @IsString({ each: true })
  idTokenSigningAlgValues: (
    | AsymmetricSigningAlgorithm
    | SymmetricSigningAlgorithm
  )[];

  @IsArray()
  @IsString({ each: true })
  introspectionEncryptionAlgValues: EncryptionAlgValues[];

  @IsArray()
  @IsString({ each: true })
  introspectionEncryptionEncValues: EncryptionEncValues[];

  @IsArray()
  @IsString({ each: true })
  introspectionEndpointAuthSigningAlgValues: AsymmetricSigningAlgorithm[];

  @IsArray()
  @IsString({ each: true })
  introspectionSigningAlgValues: (
    | AsymmetricSigningAlgorithm
    | SymmetricSigningAlgorithm
  )[];

  @IsArray()
  @IsString({ each: true })
  requestObjectEncryptionAlgValues: EncryptionAlgValues[];

  @IsArray()
  @IsString({ each: true })
  requestObjectEncryptionEncValues: EncryptionEncValues[];

  @IsArray()
  @IsString({ each: true })
  requestObjectSigningAlgValues: (
    | AsymmetricSigningAlgorithm
    | SymmetricSigningAlgorithm
  )[];

  @IsArray()
  @IsString({ each: true })
  revocationEndpointAuthSigningAlgValues: AsymmetricSigningAlgorithm[];

  @IsArray()
  @IsString({ each: true })
  tokenEndpointAuthSigningAlgValues: (
    | AsymmetricSigningAlgorithm
    | SymmetricSigningAlgorithm
  )[];

  @IsArray()
  @IsString({ each: true })
  userinfoEncryptionAlgValues: EncryptionAlgValues[];

  @IsArray()
  @IsString({ each: true })
  userinfoEncryptionEncValues: EncryptionEncValues[];

  @IsArray()
  @IsString({ each: true })
  userinfoSigningAlgValues: (
    | AsymmetricSigningAlgorithm
    | SymmetricSigningAlgorithm
  )[];
}

class Jwks {
  @IsArray()
  /**
   * @TODO #143 properly validate keys
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/143
   */
  readonly keys: Array<unknown>;
}

class OidcProviderInteractionConfig {
  /**
   * `interactionUrl` is a function.
   * This is not something that should live in a DTO.
   * Although this is the way `oidc-provider` library offers
   * to implement our logout service
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#interactionsurl
   *
   * This property is optional because it is injected by the module
   * rather than by real configuration.
   */
  @IsOptional()
  readonly url: InteractionUrlCallback;
}

class AllClientMetadataValidator implements AllClientMetadata {
  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly redirect_uris?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly grant_types?: string[];

  @IsArray()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly response_types?: ResponseType[];

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly application_type?: 'web' | 'native';

  @IsNumber()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_id_issued_at?: number;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_name?: string;

  @IsNumber()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret_expires_at?: number;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_secret?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly client_uri?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly contacts?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly default_acr_values?: string[];

  @IsNumber()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly default_max_age?: number;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_signed_response_alg?: SigningAlgorithmWithNone;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly initiate_login_uri?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly jwks_uri?: string;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly jwks?: { keys: JWK[] };

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly logo_uri?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly policy_uri?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly post_logout_redirect_uris?: string[];

  @IsBoolean()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly require_auth_time?: boolean;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly scope?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly sector_identifier_uri?: string;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly subject_type?: SubjectTypes;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_method?: ClientAuthMethod;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly tos_uri?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly tls_client_auth_subject_dn?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly tls_client_auth_san_dns?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly tls_client_auth_san_uri?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly tls_client_auth_san_ip?: string;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly tls_client_auth_san_email?: string;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly token_endpoint_auth_signing_alg?: SigningAlgorithm;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_signed_response_alg?: SigningAlgorithmWithNone;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_signed_response_alg?: SigningAlgorithmWithNone;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_encrypted_response_alg?: EncryptionAlgValues;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly introspection_encrypted_response_enc?: EncryptionEncValues;

  @IsBoolean()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly backchannel_logout_session_required?: boolean;

  @IsString()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly backchannel_logout_uri?: string;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_signing_alg?: SigningAlgorithmWithNone;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_encryption_alg?: EncryptionAlgValues;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_object_encryption_enc?: EncryptionEncValues;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly request_uris?: string[];

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_alg?: EncryptionAlgValues;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly id_token_encrypted_response_enc?: EncryptionEncValues;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_alg?: EncryptionAlgValues;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly userinfo_encrypted_response_enc?: EncryptionEncValues;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly authorization_signed_response_alg?: SigningAlgorithm;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly authorization_encrypted_response_alg?: EncryptionAlgValues;

  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly authorization_encrypted_response_enc?: EncryptionEncValues;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly web_message_uris?: string[];

  @IsBoolean()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly tls_client_certificate_bound_access_tokens?: boolean;

  @IsBoolean()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly require_signed_request_object?: boolean;

  @IsBoolean()
  @IsOptional()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly require_pushed_authorization_requests?: boolean;

  [key: string]: unknown;
}

export class Pkce {
  readonly methods: PKCEMethods[];

  readonly required: (ctx, client) => boolean;
}

/** Non exhaustive
 * @see https://tools.ietf.org/html/rfc6749#page-73
 * @see https://oauth.net/2/grant-types/
 */
type GrantType =
  | 'authorization_code'
  | 'refresh_token'
  | 'device_code'
  | 'client_credentials'
  | 'password';

export class Configuration {
  @IsObject()
  @IsOptional()
  readonly adapter?: AdapterConstructor;

  @IsObject()
  @ValidateNested()
  @Type(() => Routes)
  readonly routes: Routes;

  @IsObject()
  @ValidateNested()
  @Type(() => Cookies)
  readonly cookies: Cookies;

  @IsArray()
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly grant_types_supported: GrantType[];

  @IsObject()
  @ValidateNested()
  @Type(() => Features)
  readonly features: Features;

  @IsBoolean()
  readonly acceptQueryParamAccessTokens: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => Ttl)
  readonly ttl: Ttl;

  @IsArray()
  readonly acrValues: string[];

  @IsArray()
  readonly scopes: string[];

  @IsObject()
  readonly claims: any;

  @IsObject()
  @ValidateNested()
  @Type(() => AllClientMetadataValidator)
  readonly clientDefaults: AllClientMetadataValidator;

  @IsArray()
  @IsString({ each: true })
  readonly responseTypes: ResponseType[];

  @IsArray()
  @IsString({ each: true })
  readonly revocationEndpointAuthMethods: ClientAuthMethod[];
  @IsArray()
  @IsString({ each: true })
  readonly tokenEndpointAuthMethods: ClientAuthMethod[];

  @IsObject()
  @ValidateNested()
  @Type(() => EnabledJWA)
  readonly enabledJWA: EnabledJWA;

  /**
   * clients is not loaded from real configuration
   * but is loaded from database after configuration is initialized.
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#clients
   *
   * Thus we have to make it optional for the time being
   */
  @IsArray()
  @IsOptional()
  readonly clients?: any[];

  /**
   * `findAccount` is a function.
   * This is not something that should live in a DTO.
   * Although this is the way `oidc-provider` library offers
   * to implement our data resolver
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#findaccount
   *
   * This property is optional because it is injected by the module
   * rather than by real configuration.
   */
  @IsOptional()
  readonly findAccount?: FindAccountCallback;

  /**
   * pairwiseIdentifier is a function
   * This is not something that should live in a DTO.
   * Although this is the way `oidc-provider` library offers
   * to implement our sub generator
   *
   * We do not actually generate our sub in this function, since we want to be able
   * to control this mechanism at the application level (ie. in the apps/** folder).
   * We just provide a passthru implementation that will override default implementation,
   * and forward the sub provided in the identity (retrieved by `findAccount` (information about this function just above))
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#pairwiseidentifier
   *
   * This property is optional because it is injected by the module
   * rather than by real configuration.
   */

  readonly pairwiseIdentifier?: PairwiseIdentifierCallbacK;

  /**
   * `renderError` is a function.
   * This is not something that should live in a DTO.
   * Although this is the way `oidc-provider` library offers
   * to implement our error renderer
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#rendererror
   *
   * This property is optional because it is injected by the module
   * rather than by real configuration.
   */
  @IsOptional()
  readonly renderError?: RenderErrorCallback;

  /**
   * `interactionUrl` is an object.
   * This is not something that should live in a DTO.
   * Although this is the way `oidc-provider` library offers
   * to implement our logout service
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#interactionsurl
   *
   * This property is optional because it is injected by the module
   * rather than by real configuration.
   */
  @IsOptional()
  @ValidateNested()
  readonly interactions?: OidcProviderInteractionConfig;

  /**
   * `clientBasedCORS` is a function.
   * This is not something that should live in a DTO.
   * Although this is the way `oidc-provider` library offers
   * to implement our client based CORS
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#clientbasedcors
   *
   * This property is optional because it is injected by the module
   * rather than by real configuration.
   */
  @IsOptional()
  readonly clientBasedCORS?: ClientBasedCORSCallback;

  @ValidateNested()
  @Type(() => Jwks)
  @IsOptional()
  readonly jwks?: Jwks;

  @IsArray()
  @IsIn(['public', 'pairwise'], { each: true })
  readonly subjectTypes: SubjectTypes[];

  @IsNumber()
  readonly timeout: number;

  @IsOptional()
  readonly pkce?: Pkce;
}

export class OidcProviderConfig {
  @IsString()
  readonly prefix: string;

  @IsString()
  readonly issuer: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Configuration)
  readonly configuration: Configuration;

  @IsArray()
  @IsEnum(OidcProviderPrompt, { each: true })
  readonly forcedPrompt: OidcProviderPrompt[];

  /**
   * Those values must be coherent with "configuration.acrValues" defined here.
   * It could contain more values though (because you can know more than you accept).
   * Exemple:
   * - configuration.acrValues -> ['anyAcr_2', 'anyAcr_3']
   * - knownAcrValues -> ['anyAcr_1', 'anyAcr_2', 'anyAcr_3']
   * - defaultAcrValue -> 'anyAcr_3'
   */
  @IsArray()
  readonly knownAcrValues: string[];

  @IsString()
  readonly defaultAcrValue: string;
}
