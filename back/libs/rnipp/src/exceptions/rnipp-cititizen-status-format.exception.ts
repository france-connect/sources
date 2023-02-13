/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Description("Erreur technique lors de l'appel RNIPP, contacter le support N3")
export class RnippCitizenStatusFormatException extends RnippBaseException {
  public readonly code = ErrorCode.CITIZEN_STATUS_FORMAT;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;
}
