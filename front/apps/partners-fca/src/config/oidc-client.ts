/* istanbul ignore file */

// declarative file
import { OidcClientConfig } from '@fc/oidc-client';

export const OidcClient: OidcClientConfig = {
  endpoints: {
    authorizeUrl: '',
    endSessionUrl: '/api/logout',
    getUserInfos: '',
    redirectToIdp: '',
  },
};
