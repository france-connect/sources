/* istanbul ignore file */

// Declarative code
import { Description, Loggable } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { I18nBaseException } from './i18n-base-exception';

@Loggable()
@Description(
  'La variable passée en paramètre de traduction pour la gestion du pluriel est invalide ou manquante',
)
export class I18nInvalidOrMissingCountVariableException extends I18nBaseException {
  code = ErrorCode.INVALID_OR_MISSING_COUNT_VARIABLE;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
