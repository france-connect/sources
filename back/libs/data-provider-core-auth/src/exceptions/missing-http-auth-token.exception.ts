/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description(
  "Impossible d'extraire le token d'authentification, l'entête 'authorization' est absent",
)
export class MissingHttpAuthTokenException extends DataProviderCoreAuthBaseException {
  code = ErrorCode.MISSING_AUTH_TOKEN;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
