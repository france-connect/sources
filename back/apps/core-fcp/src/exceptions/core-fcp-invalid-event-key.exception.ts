/* istanbul ignore file */

// Declarative code
import { CoreBaseException, ErrorCode } from '@fc/core';
/**
 * @todo #992 do not extend class from @fc/core, use a specific BaseException instead
 * This might be done while removing @fc/core altogether in favor of a light code duplication
 * between core-fcp and core-fca.
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/992
 * @ticket 992
 */
export class CoreFcpInvalidEventKeyException extends CoreBaseException {
  static CODE = ErrorCode.INVALID_CONSENT_PROCESS;
  static DOCUMENTATION =
    'La configuration du FS concernant le consentement demandé est incorrect ( un consentement est demandé sur une connexion anonyme, ... ). Contacter le support N3.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'CoreFcp.exceptions.coreFcpInvalidEventKey';
}
