/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { Dto2FormBaseException } from './dto2form-base.exception';

@Description('La classe cible n\'est pas de type "FormDtoBase".')
export class Dto2FormInvalidFormException extends Dto2FormBaseException {
  code = ErrorCode.INVALID_FORM;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
