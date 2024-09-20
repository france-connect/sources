/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { CoreBaseException, ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions-deprecated';
/**
 * @todo #992 do not extend class from @fc/core, use a specific BaseException instead
 * This might be done while removing @fc/core altogether in favor of a light code duplication
 * between core-fcp and core-fca.
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/992
 * @ticket 992
 */
@Description(
  'Le mandat sélectionné ne contient pas les autorisations nécessaires à la connexion sur ce service. Vous pouvez recommencer la connexion avec un mandat présentant les autorisations nécessaires. Si cela persiste, contacter le support N3',
)
export class CoreFcpInvalidRepScopeException extends CoreBaseException {
  code = ErrorCode.INVALID_REP_SCOPE;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
