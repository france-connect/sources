import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionBadStringifyException extends SessionBaseException {
  static CODE = ErrorCode.BAD_STRINGIFY;
  static DOCUMENTATION =
    "Les données pour la session se sont mal formatées avant d'être chiffrées. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Session.exceptions.sessionBadStringify';
}
