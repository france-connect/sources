/* istanbul ignore file */

// declarative file
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description(
  "L'identité reçue lors de la vérification de token n'est pas valide",
)
export class InvalidIdentityException extends DataProviderCoreAuthBaseException {
  code = ErrorCode.INVALID_IDENTITY_TOKEN;
  public readonly httpStatusCode = HttpStatus.FORBIDDEN;

  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
}
