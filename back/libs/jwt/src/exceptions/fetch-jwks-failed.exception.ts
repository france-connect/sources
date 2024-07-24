/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description('Impossible pour le jwt service de joindre le JWKS endpoint')
export class FetchJwksFailedException extends JwtBaseException {
  code = ErrorCode.FETCH_JWKS_FAILED;
  message = 'Failed to fetch JWKS';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'failed to fetch JWKS';
}
