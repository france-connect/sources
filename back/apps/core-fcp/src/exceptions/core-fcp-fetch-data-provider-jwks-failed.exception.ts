/* istanbul ignore file */

// Declarative file
import { CoreBaseException } from '@fc/core';
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';

@Description(
  'Impossible pour le core de joindre le JWKS du fournisseur de données',
)
export class CoreFcpFetchDataProviderJwksFailedException extends CoreBaseException {
  code = ErrorCode.FETCH_DATA_PROVIDER_JWKS_FAILED;
  message = 'Failed to fetch data provider JWKS';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'failed to fetch data provider JWKS';
}
