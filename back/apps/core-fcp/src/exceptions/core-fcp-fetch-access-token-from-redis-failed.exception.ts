/* istanbul ignore file */

// Declarative file
import { HttpStatus } from '@nestjs/common';

import { CoreBaseException } from '@fc/core';
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';

@Description('La requête redis pour récupérer le TTL du token a échoué')
export class CoreFcpFetchAccessTokenFromRedisFailed extends CoreBaseException {
  public readonly code = ErrorCode.FETCH_ACCESS_TOKEN_FROM_REDIS_FAILED;

  public readonly error = 'server_error';
  public readonly message =
    'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.';
  public readonly httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}
