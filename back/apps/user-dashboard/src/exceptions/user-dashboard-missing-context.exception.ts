/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { UserDashboardBaseException } from './user-dashboard-base.exception';

export class UserDashboardMissingContextException extends UserDashboardBaseException {
  static DOCUMENTATION =
    "La requête HTTP n'est pas valide, le tableau de bord n'a pas pu la traiter car il manque des éléments obligatoires ( headers, ... ). Cette erreur ne devrait pas se produire, contacter le service technique";
  static CODE = ErrorCode.MISSING_CONTEXT;
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'mandatory parameter missing';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'UserDashboard.exceptions.userDashboardMissingContext';
}
