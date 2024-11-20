/* istanbul ignore file */

// declarative code
import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionBadAliasException extends SessionBaseException {
  static CODE = ErrorCode.BAD_SESSION_ALIAS;
  static DOCUMENTATION =
    "L'identifiant de session n'est pas valide, il n'est pas possible de trouver une session correspondante. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static UI = 'Session.exceptions.sessionBadAlias';
}
