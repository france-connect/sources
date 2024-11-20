/* istanbul ignore file */

// Declarative code
import { CoreBaseException } from '@fc/core';

import { ErrorCode } from '../enums';
/**
 * @todo #992 do not extend class from @fc/core, use a specific BaseException instead
 * This might be done while removing @fc/core altogether in favor of a light code duplication
 * between core-fcp and core-fca.
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/992
 * @ticket 992
 */
export class CoreFcpFailedAbortSessionException extends CoreBaseException {
  static CODE = ErrorCode.FAILED_ABORT_SESSION;
  static DOCUMENTATION =
    'Le système a échoué à terminer la session avant une redirection vers le Fournisseur de Service';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'CoreFcp.exceptions.coreFcpFailedAbortSession';
}
