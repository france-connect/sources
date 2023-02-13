/* istanbul ignore file */

// declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  'Cette erreur technique est émise lorsque le session id est introuvable dans l\'objet "req". L\'interceptor de la session a-t-il pu récupérer le cookie de session ?',
)
export class SessionNoSessionIdException extends SessionBaseException {
  public readonly code = ErrorCode.NO_SESSION_ID;
  public readonly httpStatusCode = HttpStatus.UNAUTHORIZED;

  /* eslint-disable @typescript-eslint/no-unused-vars */
  constructor() {
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
