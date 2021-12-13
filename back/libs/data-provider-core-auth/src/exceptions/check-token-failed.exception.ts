/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description(
  "La vérification du token par le core a échoué, plus de détails dans le message d'erreur",
)
export class CheckTokenFailedException extends DataProviderCoreAuthBaseException {
  code = 5;
}
