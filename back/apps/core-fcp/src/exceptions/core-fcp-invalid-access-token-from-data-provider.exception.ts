/* istanbul ignore file */

// Declarative file
import { HttpStatus } from '@nestjs/common';

import { CoreBaseException } from '@fc/core';
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';

@Description(
  'Impossible pour le core de joindre le JWKS du fournisseur de données',
)
export class CoreFcpInvalidAccessTokenFromDataProvider extends CoreBaseException {
  constructor(public readonly redisCode: string) {
    super(new Error(`Redis returned error: ${redisCode}`));
  }

  public readonly code = ErrorCode.INVALID_ACCESS_TOKEN_FROM_DATA_PROVIDER;

  public readonly error = 'invalid_token';
  public readonly message = 'The access token is invalid or expired';
  public readonly httpStatusCode = HttpStatus.NOT_FOUND;
}
