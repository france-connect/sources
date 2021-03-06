/* istanbul ignore file */

// declarative file
export interface OidcClientConfig {
  endpoints: {
    redirectToIdp: string;
    authorizeUrl: string;
    endSessionUrl?: string;
    getEndSessionUrl?: string;
    getUserInfos: string;
    // @TODO refacto OidcClient
    returnButtonUrl?: string;
  };
  csrf?: string;
}
