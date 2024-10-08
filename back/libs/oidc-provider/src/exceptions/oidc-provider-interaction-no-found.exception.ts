/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description(
  "L'identifiant de cinématique ( interactionId ou sub ) n'a pas été retrouvé dans le contexte de la requête. Cela peut-être dû à un problème de session ou une manipulation de cet identifiant par l'utilisateur (pour l'interactionId).  Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class OidcProviderInteractionNotFoundException extends OidcProviderBaseException {
  public readonly code = ErrorCode.INTERACTION_NOT_FOUND;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
