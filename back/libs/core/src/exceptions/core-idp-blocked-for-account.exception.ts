/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description("Le fournisseur d'identité a été bloqué par l'utilisateur.")
export class CoreIdpBlockedForAccountException extends CoreBaseException {
  code = ErrorCode.CORE_IDP_BLOCKED_FOR_ACCOUNT;

  public readonly httpStatusCode = HttpStatus.FORBIDDEN;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';

  constructor() {
    super(
      "Vous avez bloqué l'utilisation de ce fournisseur d'identité. Pour pouvoir l'utiliser, merci de vous rendre dans vos préférences FranceConnect pour l'autoriser.",
    );
  }
}
