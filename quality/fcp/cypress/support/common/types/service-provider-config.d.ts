export interface ServiceProviderConfig
  extends Record<string, string | string[]> {
  name: string;
  signupId: string;
  // platform used only for fc-exploitation legacy
  platform?: string;
  redirectUri: string;
  redirectUriLogout: string;
  site: string;
  jwksUri: string;
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
  userinfo_encrypted_response_enc: string;
  userinfo_encrypted_response_alg: string;
  userinfo_signed_response_alg: string;
  id_token_signed_response_alg: string;
  id_token_encrypted_response_alg: string;
  id_token_encrypted_response_enc: string;
  entityId: string;
  // clientId retrieved after SP creation
  clientId?: string;
}
