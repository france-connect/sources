/* istanbul ignore file */

// declarative file
import type { OidcClientConfig } from '@fc/oidc-client';

export const OidcClient: OidcClientConfig = {
  endpoints: {
    authorizeUrl: '/api/oidc-client/get-authorize-url',
    endSessionUrl: '/api/logout',
    getUserInfos: '/api/me',
    redirectToIdp: '/api/redirect-to-idp',
  },
};
