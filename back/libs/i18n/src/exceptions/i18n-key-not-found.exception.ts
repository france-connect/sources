import { ErrorCode } from '../enums';
import { I18nBaseException } from './i18n-base.exception';

export class I18nKeyNotFoundException extends I18nBaseException {
  static DOCUMENTATION = "La clé de traduction demandée n'a pas été trouvée";
  static CODE = ErrorCode.KEY_NOT_FOUND;
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'I18n.exceptions.i18nKeyNotFound';

  constructor(key: string) {
    super();

    this.log = { key };
  }
}
