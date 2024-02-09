/* istanbul ignore file */

// Declarative code
import { CoreBaseException } from '@fc/core';
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
/**
 * @todo #992 do not extend class from @fc/core, use a specific BaseException instead
 * This might be done while removing @fc/core altogether in favor of a light code duplication
 * between core-fcp and core-fca.
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/992
 * @ticket 992
 */
@Description(
  'Le système a échoué à terminer la session avant une redirection vers le Fournisseur de Service',
)
export class CoreFcpFailedAbortSessionException extends CoreBaseException {
  code = ErrorCode.FAILED_ABORT_SESSION;
  message =
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
