/* istanbul ignore file */

// Declarative code

import { ErrorCode } from '../enums';
import { Dto2FormBaseException } from './dto2form-base.exception';

export class Dto2FormValidateIfRuleNotFoundException extends Dto2FormBaseException {
  static CODE = ErrorCode.VALIDATE_IF_RULE_NOT_FOUND;
  static DOCUMENTATION =
    "Une des fonctions de validation conditionelle (validateIf) du formulaire en cours de validation n'existe pas.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Dto2form.exceptions.dto2formValidateIfRuleNotFound';
}
