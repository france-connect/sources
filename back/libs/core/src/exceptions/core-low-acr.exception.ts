/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

export class CoreLowAcrException extends CoreBaseException {
  static CODE = ErrorCode.LOW_ACR;
  static DOCUMENTATION = `Le niveau eIDAS renvoyé par le FI est plus faible que celui demandé par le FS. L'utilisateur doit recommencer la cinématique. Si le problème persiste, contacter le support N3`;
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
  static SCOPE = 2; // identity provider scope
  static UI = 'Core.exceptions.coreLowAcr';
}
