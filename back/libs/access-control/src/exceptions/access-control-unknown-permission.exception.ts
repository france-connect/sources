import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { AccessControlBaseException } from './access-control-base.exception';

export class UnknownPermissionException extends AccessControlBaseException {
  static DOCUMENTATION =
    "le rôle demandé est inconnu. Merci de vérifier la liste des droits de l'utilisateur";
  static CODE = ErrorCode.UNKNOWN_PERMISSION;
  static UI = 'AccessControl.exceptions.UnknownPermissionException';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
}
