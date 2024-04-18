/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

@Description("Un problème est survenu lors de l'appel au checktoken")
export class ChecktokenInvalidAlgorithmException extends ChecktokenBaseException {
  public readonly code = ErrorCode.CHECKTOKEN_INVALID_ALGORYTHM;
  message =
    'The encryption algorithm for the configured checktoken does not match the one received.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
