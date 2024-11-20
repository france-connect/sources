/* istanbul ignore file */

// declarative code
import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionBadFormatException extends SessionBaseException {
  static CODE = ErrorCode.BAD_SESSION_FORMAT;
  static DOCUMENTATION =
    "Les éléments présents dans la session de l'utilisateur ne sont pas valides. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static UI = 'Session.exceptions.sessionBadFormat';
}
