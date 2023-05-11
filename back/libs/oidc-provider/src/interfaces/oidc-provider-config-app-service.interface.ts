/* istanbul ignore file */

// Declarative code
import { KoaContextWithOIDC, Provider } from 'oidc-provider';

import { OidcSession } from '@fc/oidc';

export interface IOidcProviderConfigAppService {
  logoutSource(ctx: KoaContextWithOIDC, form: string);
  postLogoutSuccessSource(ctx: KoaContextWithOIDC);
  findAccount(ctx: KoaContextWithOIDC, sessionId: string);
  finishInteraction(req: any, res: any, session: OidcSession);
  setProvider(provider: Provider);
}
