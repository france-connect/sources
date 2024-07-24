/* istanbul ignore file */

// Declarative code
import { IOidcIdentity } from '@fc/oidc';

export interface OidcIdentityInterface extends IOidcIdentity {
  idp_id: string;
}
