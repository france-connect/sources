/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description('Impossible de déchiffrer le JWT')
export class CanNotDecryptException extends JwtBaseException {
  code = ErrorCode.CAN_NOT_DECRYPT;
  message = 'Can not decrypt';
}
