/* istanbul ignore file */

// Declarative code

import { ErrorCode } from '../enums';
import { Dto2FormBaseException } from './dto2form-base.exception';

export class Dto2FormInvalidFormException extends Dto2FormBaseException {
  static CODE = ErrorCode.INVALID_FORM;
  static DOCUMENTATION = 'La classe cible n\'est pas de type "FormDtoBase".';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Dto2form.exceptions.dto2formInvalidForm';
}
