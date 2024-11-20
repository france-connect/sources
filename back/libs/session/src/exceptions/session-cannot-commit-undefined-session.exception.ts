/* istanbul ignore file */

// declarative code
import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionCannotCommitUndefinedSession extends SessionBaseException {
  static CODE = ErrorCode.CANNOT_COMMIT;
  static DOCUMENTATION =
    "La session n'a pas été trouvé au moment ou elle aurait due être sauvegardée. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static UI = 'Session.exceptions.sessionCannotCommitUndefinedSession';
}
