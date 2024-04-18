/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description, Loggable, Trackable } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Loggable(false)
@Trackable()
@Description("Demande identifiée avec le nom d'usage uniquement")
export class RnippFoundOnlyWithMaritalNameException extends RnippBaseException {
  public readonly code = ErrorCode.FOUND_ONLY_WITH_MARITAL_NAME;
  public readonly message =
    "Un problème lié à vos données d'identité empêche la connexion d'aboutir. Nous vous invitons à nous contacter pour corriger le problème.";
  public readonly httpStatusCode = HttpStatus.FORBIDDEN;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
}
