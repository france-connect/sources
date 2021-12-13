/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description(
  "Impossible d'extraire le token d'authentification, le format est invalide",
)
export class InvalidHttpAuthTokenException extends DataProviderCoreAuthBaseException {
  code = 1;
}
