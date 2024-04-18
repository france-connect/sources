/* istanbul ignore file */

import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { DataProviderAdapterMongoBaseException } from './data-provider-adapter-mongo-base.exception';

// Declarative file
@Description('Aucun fournisseur de données trouvé avec ce client_id.')
export class DataProviderNotFoundException extends DataProviderAdapterMongoBaseException {
  code = ErrorCode.DATA_PROVIDER_NOT_FOUND;
  public readonly httpStatusCode = HttpStatus.UNAUTHORIZED;
  public readonly error = 'invalid_client';
  message = 'Unknown client.';

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
}
