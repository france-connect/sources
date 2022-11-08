/* istanbul ignore file */

// Declarative code
import { IOidcIdentity } from '@fc/oidc';

export interface OidcIdentityInterface extends IOidcIdentity {
  // fc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  idp_id: string;
}
