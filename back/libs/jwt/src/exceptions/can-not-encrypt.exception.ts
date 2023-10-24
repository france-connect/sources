/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description('Impossible de chiffrer le JWT')
export class CanNotEncryptException extends JwtBaseException {
  code = ErrorCode.CAN_NOT_ENCRYPT;
  message = 'Can not encrypt';
}
