/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Description(
  "Erreur de communication avec le RNIPP (pas de réponse du RNIPP). L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class RnippTimeoutException extends RnippBaseException {
  public readonly code = ErrorCode.REQUEST_TIMEOUT;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.GATEWAY_TIMEOUT;
}
