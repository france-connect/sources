/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class CanNotDecryptException extends JwtBaseException {
  static DOCUMENTATION = 'Impossible de déchiffrer le JWT';
  static CODE = ErrorCode.CAN_NOT_DECRYPT;
  static UI = 'Jwt.exceptions.canNotDecrypt';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
