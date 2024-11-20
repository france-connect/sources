/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class FetchJwksFailedException extends JwtBaseException {
  static CODE = ErrorCode.FETCH_JWKS_FAILED;
  static DOCUMENTATION =
    'Impossible pour le jwt service de joindre le JWKS endpoint';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'failed to fetch JWKS';
  static UI = 'Jwt.exceptions.fetchJwksFailed';
}
