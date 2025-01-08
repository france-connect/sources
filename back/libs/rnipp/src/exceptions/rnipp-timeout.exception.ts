import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippTimeoutException extends RnippBaseException {
  static CODE = ErrorCode.REQUEST_TIMEOUT;
  static DOCUMENTATION =
    "Erreur de communication avec le RNIPP (pas de réponse du RNIPP). L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3";
  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.GATEWAY_TIMEOUT;
  static UI = 'Rnipp.exceptions.rnippTimeout';
}
