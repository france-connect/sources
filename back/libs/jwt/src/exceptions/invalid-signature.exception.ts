/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class InvalidSignatureException extends JwtBaseException {
  code = ErrorCode.INVALID_SIGNATURE;
  message = 'Signature not verified';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
