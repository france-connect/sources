/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { DataProviderAdapterMongoBaseException } from './data-provider-adapter-mongo-base.exception';

@Description(
  "Le client_id ou le client_secret ne correspond pas à celui d'un fournisseur de données.",
)
export class DataProviderInvalidCredentialsException extends DataProviderAdapterMongoBaseException {
  code = ErrorCode.INVALID_CREDENTIALS;
  message = 'Client authentication failed.';
  public readonly httpStatusCode = HttpStatus.UNAUTHORIZED;
  public readonly error = 'invalid_client';

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
}
