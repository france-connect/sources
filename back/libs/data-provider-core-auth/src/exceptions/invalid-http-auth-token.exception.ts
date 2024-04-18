/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description(
  "Impossible d'extraire le token d'authentification, le format est invalide",
)
export class InvalidHttpAuthTokenException extends DataProviderCoreAuthBaseException {
  code = ErrorCode.INVALID_AUTH_TOKEN;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
