/* istanbul ignore file */

// Declarative code
import { Description, Loggable, Trackable } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Loggable(false)
@Trackable()
@Description(
  "Le RNIPP a trouvé un echo mais pas suffisamment proche de l'identité demandée",
)
export class RnippNotFoundSingleEchoException extends RnippBaseException {
  public readonly code = ErrorCode.NOT_FOUND_SINGLE_ECHO;
  public readonly message =
    "Un problème lié à vos données d'identité empêche la connexion d'aboutir. Nous vous invitons à nous contacter pour corriger le problème.";
}
