import { ErrorCode } from '../enums';
import { I18nBaseException } from './i18n-base.exception';

export class I18nInvalidOrMissingCountVariableException extends I18nBaseException {
  static CODE = ErrorCode.INVALID_OR_MISSING_COUNT_VARIABLE;
  static DOCUMENTATION =
    'La variable passée en paramètre de traduction pour la gestion du pluriel est invalide ou manquante';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'I18n.exceptions.i18nInvalidOrMissingCountVariable';
}
