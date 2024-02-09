/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description('Impossible de déchiffrer le JWT')
export class CanNotDecryptException extends JwtBaseException {
  code = ErrorCode.CAN_NOT_DECRYPT;
  message = 'Can not decrypt';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
