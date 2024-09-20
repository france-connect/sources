/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { Dto2FormBaseException } from './dto2form-base.exception';

@Description(
  "Une des fonctions de validation conditionelle (validateIf) du formulaire en cours de validation n'existe pas.",
)
export class Dto2FormValidateIfRuleNotFoundException extends Dto2FormBaseException {
  code = ErrorCode.VALIDATE_IF_RULE_NOT_FOUND;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
