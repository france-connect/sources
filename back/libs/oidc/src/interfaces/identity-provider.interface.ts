import { ClientMetadata, IssuerMetadata } from '../dto';

/**
 * Alias and export interface provided by `openid-client` from our module,
 * so that we do not expose our depency to `openid-client`.
 */
/**
 * @todo #429 améliorer le typage pour affiner l'ajout de données (FeatureHandler...)
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/429
 */

export interface IdpFCMetadata {
  uid: string;
  url: string;
  name: string;
  image: string;
  title: string;
  active: boolean;
  display: boolean;
  discovery: boolean;
  discoveryUrl?: string;
  featureHandlers: {
    [key: string]: string;
  };
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  maxAuthorizedAcr: string;
}

export type IdentityProviderMetadata = IdpFCMetadata & {
  client: ClientMetadata;
  issuer: IssuerMetadata;
};
