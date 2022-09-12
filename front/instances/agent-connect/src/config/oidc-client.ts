/* istanbul ignore file */

// declarative file
import { OidcClientConfig } from '@fc/oidc-client';

export const OidcClient: OidcClientConfig = {
  endpoints: {
    authorizeUrl: '/api/oidc-client/get-authorize-url',
    getEndSessionUrl: '/api/oidc-client/get-end-session-url',
    getUserInfos: '/api/oidc-client/load-user-infos',
    redirectToIdp: '/api/v2/redirect-to-idp',
    // @TODO refacto OidcClient
    returnButtonUrl: '/api/v2/history-back-url',
  },
};
