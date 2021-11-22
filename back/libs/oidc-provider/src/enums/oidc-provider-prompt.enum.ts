/**
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1
 */
export enum OidcProviderPrompt {
  NONE = 'none',
  LOGIN = 'login',
  CONSENT = 'consent',
  SELECT_ACCOUNT = 'select_account',
}
