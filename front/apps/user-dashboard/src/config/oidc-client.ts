/* istanbul ignore file */

// declarative file
import { OidcClientConfig } from '@fc/oidc-client';

export const OidcClient: OidcClientConfig = {
  endpoints: {
    authorizeUrl: '/api/oidc-client/get-authorize-url',
    getEndSessionUrl: '/api/oidc-client/get-end-session-url',
    getUserInfos: '/api/me',
    redirectToIdp: '/api/redirect-to-idp',
  },
};
