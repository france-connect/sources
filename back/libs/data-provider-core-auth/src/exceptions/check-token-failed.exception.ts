/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description(
  "La vérification du token par le core a échoué, plus de détails dans le message d'erreur",
)
export class CheckTokenFailedException extends DataProviderCoreAuthBaseException {
  code = ErrorCode.CHECK_TOKEN;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
