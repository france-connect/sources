/* istanbul ignore file */

// declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

export class SessionSubNotFoundException extends SessionBaseException {
  static CODE = ErrorCode.SUB_NOT_FOUND;
  static DOCUMENTATION =
    "Erreur émise lorsque l'on ne retrouve pas le sub dans la session, probablement une fenêtre restée ouverte au delà des 10 minutes. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
  static UI = 'Session.exceptions.sessionSubNotFound';
}
