export enum OidcClientRoutes {
  REDIRECT_TO_IDP = '/redirect-to-idp',
  OIDC_CALLBACK_LEGACY = '/oidc-callback/:providerUid',
  OIDC_CALLBACK = '/oidc-callback',
  WELL_KNOWN_KEYS = '/client/.well-known/keys',
}
