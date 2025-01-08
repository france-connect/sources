import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class CanNotSignJwtException extends JwtBaseException {
  static CODE = ErrorCode.CAN_NOT_SIGN_JWT;
  static DOCUMENTATION = 'Impossible de signer le JWT';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Jwt.exceptions.canNotSignJwt';
}
