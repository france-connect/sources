/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description('Impossible de chiffrer le JWT')
export class CanNotEncryptException extends JwtBaseException {
  code = ErrorCode.CAN_NOT_ENCRYPT;
  message = 'Can not encrypt';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
