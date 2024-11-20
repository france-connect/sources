/* istanbul ignore file */

// Declarative code
import { errors } from 'oidc-provider';

import { BaseException } from '@fc/exceptions/exceptions';

export class OriginalError extends errors.OIDCProviderError {
  caught?: boolean;
  state?: string;
}
export class OidcProviderBaseException extends BaseException {
  static SCOPE = 3;
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'something bad happened';

  public originalError?: OriginalError;
}
