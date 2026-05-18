import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { AccessControlBaseException } from './access-control-base.exception';

export class AccessControlInvalidEntityIdException extends AccessControlBaseException {
  static DOCUMENTATION =
    "L'identifiant d'entité fourni n'est pas un UUIDv4 valide.";
  static CODE = ErrorCode.INVALID_ENTITY_ID;
  static UI = 'AccessControl.exceptions.AccessControlInvalidEntityIdException';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
