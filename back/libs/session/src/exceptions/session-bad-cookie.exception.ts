/* istanbul ignore file */

// declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  "Cette erreur technique est émise lorsque le cookie de session contient une valeur anormale. Ne devrait pas se produire en dehors d'une connexion malveillante.",
)
export class SessionBadCookieException extends SessionBaseException {
  public readonly code = ErrorCode.BAD_COOKIE;
  public readonly httpStatusCode = HttpStatus.UNAUTHORIZED;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';

  constructor() {
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
