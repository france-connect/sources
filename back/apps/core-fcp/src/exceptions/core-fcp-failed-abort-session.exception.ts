/* istanbul ignore file */

// Declarative code
import { CoreBaseException } from '@fc/core';
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
/**
 * @todo do not extend class from @fc/core, use a specific BaseException instead
 * This might be done while removing @fc/core altogether in favor of a light code duplication
 * between core-fcp and core-fca.
 */
@Description(
  'Le système a échoué à terminer la session avant une redirection vers le Fournisseur de Service',
)
export class CoreFcpFailedAbortSessionException extends CoreBaseException {
  code = ErrorCode.FAILED_ABORT_SESSION;
  message = 'Erreur technique';
}
