/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Description("Erreur technique lors de l'appel RNIPP, contacter le support N3")
export class RnippCitizenStatusFormatException extends RnippBaseException {
  public readonly code = ErrorCode.CITIZEN_STATUS_FORMAT;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
