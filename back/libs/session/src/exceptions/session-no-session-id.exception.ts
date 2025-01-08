import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionNoSessionIdException extends SessionBaseException {
  static CODE = ErrorCode.NO_SESSION_ID;
  static DOCUMENTATION =
    'Cette erreur technique est émise lorsque le session id est introuvable dans l\'objet "req". L\'interceptor de la session a-t-il pu récupérer le cookie de session ?';
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
  static UI = 'Session.exceptions.sessionNoSessionId';
}
