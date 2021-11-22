/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { AccountBaseException } from './account-base.exception';

@Description(
  `Le compte demandé basé sur cet identityHash n'existe pas dans la base de donnée`,
)
export class AccountNotFoundException extends AccountBaseException {
  public readonly code = ErrorCode.ACCOUNT_NOT_FOUND;

  constructor(error?: Error) {
    super(error);
    this.message =
      'Une erreur technique est survenue, veuillez contacter le support.';
  }
}
