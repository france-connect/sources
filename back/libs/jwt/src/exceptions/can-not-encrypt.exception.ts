import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class CanNotEncryptException extends JwtBaseException {
  static CODE = ErrorCode.CAN_NOT_ENCRYPT;
  static DOCUMENTATION = 'Impossible de chiffrer le JWT';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Jwt.exceptions.canNotEncrypt';
}
