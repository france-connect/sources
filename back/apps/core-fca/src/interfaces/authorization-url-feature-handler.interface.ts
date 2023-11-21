/* istanbul ignore file */

// Declarative code
import { OidcClientService } from '@fc/oidc-client';

export interface IAuthorizationUrlFeatureHandlerHandleArgument {
  oidcClient: OidcClientService;
  state: string;
  scope: string;
  idpId: string;
  // acr_values is an oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  acr_values: string;
  nonce: string;
  spId: string;
}

export interface IAuthorizationUrlServiceGetAuhtorizeArgument {
  oidcClient: OidcClientService;
  state: string;
  scope: string;
  idpId: string;
  idpFeatureHandlers: {
    [key: string]: string;
  };
  // acr_values is an oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  acr_values: string;
  nonce: string;
  spId: string;
}
