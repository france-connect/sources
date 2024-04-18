/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Description(
  "Impossible de joindre le RNIPP. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class RnippHttpStatusException extends RnippBaseException {
  public readonly code = ErrorCode.HTTP_STATUS;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.GATEWAY_TIMEOUT;

  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
