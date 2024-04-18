/* istanbul ignore file */

// Declarative code
import { Description, Loggable } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { I18nBaseException } from './i18n-base-exception';

@Loggable()
@Description("La clé de traduction demandée n'a pas été trouvée")
export class I18nKeyNotFoundException extends I18nBaseException {
  code = ErrorCode.KEY_NOT_FOUND;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
