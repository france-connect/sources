/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description(
  "Problème lors de l'initialisation de la plateforme lié au wrapper oidc-provider. La plateforme ne fonctionne pas, contacter en urgence le support N3.",
)
export class OidcProviderBindingException extends OidcProviderBaseException {
  public readonly code = ErrorCode.BINDING_PROVIDER;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
