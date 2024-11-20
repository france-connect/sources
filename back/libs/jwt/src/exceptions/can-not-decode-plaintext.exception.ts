/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class CanNotDecodePlaintextException extends JwtBaseException {
  static CODE = ErrorCode.CAN_NOT_DECODE_PLAINTEXT;
  static DOCUMENTATION = 'Impossible de décoder le JWT une fois déchiffré';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Jwt.exceptions.canNotDecodePlaintext';
}
