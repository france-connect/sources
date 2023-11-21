export interface IdentityProviderConfig
  extends Record<string, string | string[]> {
  uid?: string;
  name?: string;
  jwksUrl?: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
  discovery?: string;
  title: string;
  issuer: string;
  clientId: string;
  client_secret: string;
  messageToDisplayWhenInactive: string;
  redirectionTargetWhenInactive: string;
  alt: string;
  image: string;
  imageFocus: string;
  trustedIdentity: string;
  eidas: string;
  order: string;
  emails: string;
  specificText: string;
  token_endpoint_auth_method: string;
}
