/* istanbul ignore file */

// declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionBadCookieException extends SessionBaseException {
  static CODE = ErrorCode.BAD_COOKIE;
  static DOCUMENTATION =
    "Cette erreur technique est émise lorsque le cookie de session contient une valeur anormale. Ne devrait pas se produire en dehors d'une connexion malveillante.";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
  static UI = 'Session.exceptions.sessionBadCookie';
}
