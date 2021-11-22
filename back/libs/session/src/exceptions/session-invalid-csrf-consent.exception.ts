/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  "La page de consentement a été appelée sans avoir effectué les étapes de la cinématique. L'utilisateur doit redémarrer sa cinématique en respectant les étapes de cette dernière. Il s'agit d'une protection contre des attaques qui seraient destinées à sauter des étapes. Il se peut que l'utilisateur ait lancé des cinématiques en parallèle dans plusieurs onglets, dans ce cas il faut fermer tous les onglets du navigateur et relancer la cinématique.",
)
export class SessionInvalidCsrfConsentException extends SessionBaseException {
  public readonly code = ErrorCode.INVALID_CSRF_CONSENT;

  constructor(error?: Error) {
    super(error);
    this.message =
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';
  }
}
