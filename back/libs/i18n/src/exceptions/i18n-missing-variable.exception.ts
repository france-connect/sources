/* istanbul ignore file */

// Declarative code
import { Description, Loggable } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { I18nBaseException } from './i18n-base-exception';

@Loggable()
@Description(
  "La clé de traduction nécessite des variables mais aucune n'ont été passées en paramètre",
)
export class I18nMissingVariableException extends I18nBaseException {
  code = ErrorCode.MISSING_VARIABLES;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
