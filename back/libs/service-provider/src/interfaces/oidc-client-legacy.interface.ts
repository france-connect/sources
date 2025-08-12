export interface OidcClientLegacyInterface {
  /**
   * --------------------------------------
   * FC Related properties
   * --------------------------------------
   *
   */

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
  title: string;

  /**
   * MongoDB timestamps
   * Should they be present in this interface?
   */
  createdAt: Date;
  createdBy: string;
  createdVia: string;
  secretCreatedAt: Date;
  secretUpdatedAt: Date;
  secretUpdatedBy: string;
  updatedAt: Date;
  updatedBy: string;

  /**
   * Management only
   */
  email: string;

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
   * ??
   */
  description: string;

  /**
   * Management only
   */
  IPServerAddressesAndRanges: string[];

  /**
   * ??
   */
  idClientEmail: string;

  /**
   * ??
   */
  secretKeyPhone: string;

  /**
   * ??
   */
  contacts: string[];

  /**
   * ??
   */
  editorName: string;

  /**
   * Management only (retrieve FS)
   */
  // Legacy property name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  production_key: string;

  /**
   * Management only (retrieve FS)
   *
   * "signup" is the old name for "datapass"
   */
  signup_id: string;

  type: string;
  site: string[];

  /**
   * Legacy filter list management
   */
  blacklistByIdentityProviderActivated: boolean;
  whitelistByServiceProviderActivated: boolean;
  whitelistByIdentityProvider: object;
  blacklistByIdentityProvider: object;

  /**
   * Used while transitioning to the new platform
   */
  platform: string;

  /**
   * Dedicated to aidant-connect
   * Could actually be used more widely as a way to control permissions
   */
  rep_scope: string[];

  /**
   * ACR level available for SP?
   *
   * Used in management tool to require or not
   * encryption configuration.
   *
   * Does not seem to be used anywhere in cores.
   */
  eidas: number;

  /**
   * Not used anywhere...
   * @todo remove
   */
  credentialsFlow: boolean;

  idpFilterExclude: boolean;
  idpFilterList: string[];

  /**
   * --------------------------------------
   * openid client configuration properties
   * --------------------------------------
   * @see https://openid.net/specs/openid-connect-core-1_0.html
   */

  /**
   * client_id
   */
  key: string;
  client_secret: string;
  redirect_uris: string[];
  post_logout_redirect_uris: string[];
  sector_identifier_uri?: string;
  scopes: string[];
  userinfo_encrypted_response_enc: string;
  userinfo_encrypted_response_alg: string;
  userinfo_signed_response_alg: string;
  id_token_signed_response_alg: string;
  id_token_encrypted_response_alg: string;
  id_token_encrypted_response_enc: string;
  entityId: string;
  claims: string[];
}
