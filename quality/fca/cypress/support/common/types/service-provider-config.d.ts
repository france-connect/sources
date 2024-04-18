export interface ServiceProviderConfig {
  name: string;
  signupId: string;
  redirectUri: string;
  redirectUriLogout: string;
  site: string;
  emails: string[];
  ipAddresses: string[];
  scopes: string[];
  idpFilterExclude: string;
  idpFilterList: string[];
  active: string;
  type: string;
  identityConsent: string;
  trustedIdentity: string;
  eidas: string;
  userinfo_signed_response_alg: string;
  id_token_signed_response_alg: string;
  entityId: string;
}
