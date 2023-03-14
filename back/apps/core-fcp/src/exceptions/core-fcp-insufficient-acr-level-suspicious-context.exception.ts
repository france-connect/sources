/* istanbul ignore file */

// Declarative code
import { CoreBaseException } from '@fc/core';
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';

@Description(
  "Une connexion a eu lieu dans un context suspect et le FI a identifié l'utilisateur avec un niveau eidas jugé trop faible.",
)
export class InsufficientAcrLevelSuspiciousContextException extends CoreBaseException {
  code = ErrorCode.INSUFFICIENT_ACR_LEVEL_SUSPICIOUS_REQUEST;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
