/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description(
  "L'identité reçue lors de la vérification de token n'est pas valide",
)
export class InvalidIdentityException extends DataProviderCoreAuthBaseException {
  code = 3;
}
