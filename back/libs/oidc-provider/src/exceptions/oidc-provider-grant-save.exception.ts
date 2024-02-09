/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description('Problème de sauvegarde du grant. Contacter le support N3')
export class OidcProviderGrantSaveException extends OidcProviderBaseException {
  public readonly code = ErrorCode.GRANT_NOT_SAVED;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
