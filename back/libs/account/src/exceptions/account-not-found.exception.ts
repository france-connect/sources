import { ErrorCode } from '../enums';
import { AccountBaseException } from './account-base.exception';

export class AccountNotFoundException extends AccountBaseException {
  static CODE = ErrorCode.ACCOUNT_NOT_FOUND;
  static DOCUMENTATION = `Le compte demandé basé sur cet identityHash n'existe pas dans la base de donnée`;
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Account.exceptions.accountNotFound';
}
