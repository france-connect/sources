import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionInvalidSetCallException extends SessionBaseException {
  static CODE = ErrorCode.INVALID_SET_CALL;
  static DOCUMENTATION =
    "Un appel à 'set' de SessionLocalStorageService a été effectué avec des arguments invalides (autre qu'une clé ou un objet). Remonter l'erreur à l'équipe de développement pour analyse.";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
  static UI = 'Session.exceptions.InvalidSetCall';

  constructor(argumentType: string) {
    super();
    this.log = `Invalid argument type: ${argumentType}`;
  }
}
