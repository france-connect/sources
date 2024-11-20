/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

export class CoreNotAllowedAcrException extends CoreBaseException {
  static CODE = ErrorCode.NOT_ALLOWED_ACR;
  static DOCUMENTATION = `Le niveau eidas renvoyé par le FI n'est pas autorisé pour ce FI`;
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'idp returned a not allowed acr value';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static SCOPE = 2; // identity provider scope
  static UI = 'Core.exceptions.coreNotAllowedAcr';
}
