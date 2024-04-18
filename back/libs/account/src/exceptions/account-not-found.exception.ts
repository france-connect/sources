/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { AccountBaseException } from './account-base.exception';

@Description(
  `Le compte demandé basé sur cet identityHash n'existe pas dans la base de donnée`,
)
export class AccountNotFoundException extends AccountBaseException {
  public readonly code = ErrorCode.ACCOUNT_NOT_FOUND;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
