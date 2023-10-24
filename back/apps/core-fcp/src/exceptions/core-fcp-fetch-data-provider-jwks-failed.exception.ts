/* istanbul ignore file */

// Declarative file
import { CoreBaseException } from '@fc/core';
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';

@Description(
  'Impossible pour le core de joindre le JWKS du fournisseur de données',
)
export class CoreFcpFetchDataProviderJwksFailed extends CoreBaseException {
  code = ErrorCode.FETCH_DATA_PROVIDER_JWKS_FAILED;
  message = 'Failed to fetch data provider JWKS';
}
