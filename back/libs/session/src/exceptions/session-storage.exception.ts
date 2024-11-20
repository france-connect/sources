/* istanbul ignore file */

// declarative code
import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionStorageException extends SessionBaseException {
  static CODE = ErrorCode.STORAGE_ISSUE;
  static DOCUMENTATION =
    'Un problème est survenant lors de la récupération des données de session dans la base Redis. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Session.exceptions.sessionStorage';
}
