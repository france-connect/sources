import { OidcClientConfig } from '@fc/oidc-client';

export const OidcClient: OidcClientConfig = {
  endpoints: {
    redirectToIdp: '/api/redirect-to-idp',
    authorizeUrl: '/api/oidc-client/get-authorize-url',
    getUserInfos: '/api/oidc-client/load-user-infos',
    getEndSessionUrl: '/api/oidc-client/get-end-session-url',
  },
};
