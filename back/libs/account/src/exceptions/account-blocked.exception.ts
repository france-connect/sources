import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { AccountBaseException } from './account-base.exception';

export class AccountBlockedException extends AccountBaseException {
  static CODE = ErrorCode.ACCOUNT_BLOCKED;
  static DOCUMENTATION =
    'Un utilisateur a demandé à ce que sa connexion via FranceConnect soit désactivée. La connexion via ses identifiants est donc impossible désormais. Réactivation du compte nécessaire pour pouvoir procéder à une nouvelle connexion via ce compte.';
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
  static UI = 'Account.exceptions.accountBlocked';
}
