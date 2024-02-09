/* istanbul ignore file */

// declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  "Erreur émise lorsque l'on ne retrouve pas le sub dans la session, probablement une fenêtre restée ouverte au delà des 10 minutes. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class SessionSubNotFoundException extends SessionBaseException {
  public readonly code = ErrorCode.SUB_NOT_FOUND;
  public readonly httpStatusCode = HttpStatus.UNAUTHORIZED;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
