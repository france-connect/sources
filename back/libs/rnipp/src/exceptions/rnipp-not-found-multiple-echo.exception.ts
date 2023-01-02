/* istanbul ignore file */

// Declarative code
import { Description, Loggable, Trackable } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

// declarative code
// istanbul ignore next line
@Loggable(false)
@Trackable()
@Description("Le RNIPP a trouvé plusieurs echos pour l'identité fournie")
export class RnippNotFoundMultipleEchoException extends RnippBaseException {
  public readonly code = ErrorCode.NOT_FOUND_MULTIPLE_ECHO;
  public readonly message =
    "Un problème lié à vos données d'identité empêche la connexion d'aboutir. Nous vous invitons à nous contacter pour corriger le problème.";
}
