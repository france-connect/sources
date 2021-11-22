/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description(
  "Problème lors de l'initialisation de la plateforme lié au wrapper oidc-provider. La plateforme ne fonctionne pas, contacter en urgence le support N3.",
)
export class OidcProviderInitialisationException extends OidcProviderBaseException {
  public readonly code = ErrorCode.INIT_PROVIDER;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
