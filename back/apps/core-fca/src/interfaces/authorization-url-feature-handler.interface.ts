/* istanbul ignore file */

// Declarative code
import { OidcClientService } from '@fc/oidc-client';

export interface IAuthorizationUrlArgument {
  oidcClient: OidcClientService;
  state: string;
  scope: string;
  idpId: string;
  // acr_values is an oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  acr_values: string;
  nonce: string;
  spId: string;
  // login_hint is an oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  login_hint?: string;
}

export interface IAuthorizationUrlFeatureHandlerArgument
  extends IAuthorizationUrlArgument {
  idpFeatureHandlers: {
    [key: string]: string;
  };
}
