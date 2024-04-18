/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description('Impossible de signer le JWT')
export class CanNotSignJwtException extends JwtBaseException {
  code = ErrorCode.CAN_NOT_SIGN_JWT;
  message = 'Can not sign JWT';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
