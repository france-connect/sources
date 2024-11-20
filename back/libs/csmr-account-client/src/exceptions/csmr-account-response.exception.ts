/* istanbul ignore file */

// Declarative code
import { CsmrAccountClientErrorCode } from '../enums';
import { CsmrAccountClientBaseException } from './csmr-account-client-base.exception';

export class CsmrAccountResponseException extends CsmrAccountClientBaseException {
  static CODE = CsmrAccountClientErrorCode.CSMR_ACCOUNT_FAILED;
  static DOCUMENTATION =
    'CsmrAccountClient.exceptions.csmrAccountResponse, please check the consumer results';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'CsmrAccountClient.exceptions.csmrAccountResponse';
}
