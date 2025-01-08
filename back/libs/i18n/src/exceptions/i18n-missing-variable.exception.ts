import { ErrorCode } from '../enums';
import { I18nBaseException } from './i18n-base.exception';

export class I18nMissingVariableException extends I18nBaseException {
  static CODE = ErrorCode.MISSING_VARIABLES;
  static DOCUMENTATION =
    "La clé de traduction nécessite des variables mais aucune n'ont été passées en paramètre";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'I18n.exceptions.i18nMissingVariable';
}
