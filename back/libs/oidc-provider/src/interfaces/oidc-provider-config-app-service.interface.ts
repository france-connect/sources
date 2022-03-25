/* istanbul ignore file */

// Declarative code
import { KoaContextWithOIDC } from 'oidc-provider';

export interface IOidcProviderConfigAppService {
  logoutSource(ctx: KoaContextWithOIDC, form: string);
  postLogoutSuccessSource(ctx: KoaContextWithOIDC);
}
