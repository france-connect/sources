/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

@Description(
  "Un problème est survenu lors de l'appel au checktoken, le core est injoignable",
)
export class ChecktokenInvalidEncodingException extends ChecktokenBaseException {
  public readonly code = ErrorCode.CHECKTOKEN_INVALID_ENCODING;
  message =
    'The encryption encoding for the configured checktoken does not match the one received.';
}
