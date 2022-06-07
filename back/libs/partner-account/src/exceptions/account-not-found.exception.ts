/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { PartnerAccountBaseException } from './partner-account-base.exception';

@Description(
  "Le nom d'utilisateur ou le mot de passe est invalide. Il est recommandé d'utiliser la fonction de réinitialisation du mot de passe en cas d'erreur répétée.",
)
export class AccountNotFound extends PartnerAccountBaseException {
  public readonly code = ErrorCode.ACCOUNT_NOT_FOUND;

  constructor() {
    super("Le nom d'utilisateur ou le mot de passe est invalide.");
  }
}
