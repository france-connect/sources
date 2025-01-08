import { ErrorCode } from '../enums';
import { UserDashboardBaseException } from './user-dashboard-base.exception';

export class UserDashboardTokenRevocationException extends UserDashboardBaseException {
  static CODE = ErrorCode.TOKEN_REVOCATION;
  static DOCUMENTATION =
    "Une erreur s'est produite lors de la révocation d'un token par le userdashboard. Le token a dû expirer avec révocation. Si le problème persiste, contacter le support N3.";
  static UI = 'UserDashboard.exceptions.userDashboardTokenRevocation';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
