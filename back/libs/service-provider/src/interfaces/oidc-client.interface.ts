import {
  ClientTypeEnum,
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  PlatformTechnicalKeyEnum,
  SignatureAlgorithmEnum,
} from '../enums';

export interface OidcClientInterface {
  /**
   * --------------------------------------
   * FC Related properties
   * --------------------------------------
   *
   * Some of those properties are used in business code,
   * some other are stored only to be available through management tools
   */

  /**
   * Dedicated to aidant-connect
   * Could actually be used more widely as a way to control permissions
   */
  rep_scope: string[];

  /**
   * Filter list parameters
   */
  idpFilterExclude: boolean;
  idpFilterList: string[];

  type: ClientTypeEnum;

  /**
   * Used while transitioning to the new platform
   * @todo Remove when core-legacy is shuted down
   */
  platform?: PlatformTechnicalKeyEnum;

  /**
   * Used to generate a organisation (entity) wise sub.
   * Is defaulted by management apps to client_id value
   */
  entityId: string;

  /**
   * Toggle availability of the client
   */
  active: boolean;

  /**
   * Allow to force consent UI.
   * Must be used with type = TypeEnum.PRIVATE
   */
  identityConsent: boolean;

  /**
   * Display name of the client
   */
  name: string;

  /**
   * Alias of name
   * Not actually used but present in code
   *
   * @todo remove,
   */
  title?: string;

  /**
   * Management only
   */
  emails: string[];

  /**
   * Management only
   */
  IPServerAddressesAndRanges: string[];

  /**
   * Management only
   */
  site: string[];

  /**
   * Management only
   */
  //
  signupId: string;

  /**
   * Management only
   */
  //
  eidas: number;

  /**
   * --------------------------------------
   * openid client configuration properties
   * --------------------------------------
   * @see https://openid.net/specs/openid-connect-core-1_0.html
   */
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  post_logout_redirect_uris: string[];
  sector_identifier_uri?: string;
  scope: string[];
  claims: string[];
  id_token_signed_response_alg: SignatureAlgorithmEnum;
  id_token_encrypted_response_alg: EncryptionAlgorithmEnum;
  id_token_encrypted_response_enc: EncryptionEncodingEnum;
  userinfo_signed_response_alg: SignatureAlgorithmEnum;
  userinfo_encrypted_response_alg: EncryptionAlgorithmEnum;
  userinfo_encrypted_response_enc: EncryptionEncodingEnum;
  jwks_uri?: string;
}

export interface ServiceProviderClientInterface extends OidcClientInterface {
  createdBy?: string;
  createdVia?: string;
  updatedBy?: string;
}
