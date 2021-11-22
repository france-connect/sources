/* istanbul ignore file */

// declarative file
export interface OidcClientConfig {
  endpoints: {
    redirectToIdp: string;
    authorizeUrl: string;
    getEndSessionUrl: string;
    getUserInfos: string;
  };
  csrf?: string;
}
