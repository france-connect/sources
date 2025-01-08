import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionNotFoundException extends SessionBaseException {
  static CODE = ErrorCode.NOT_FOUND;
  static DOCUMENTATION =
    "Erreur émise lorsque l'usager n'a plus de session, probablement une fenêtre restée ouverte au delà des 10 minutes. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
  static UI = 'Session.exceptions.sessionNotFound';
}
