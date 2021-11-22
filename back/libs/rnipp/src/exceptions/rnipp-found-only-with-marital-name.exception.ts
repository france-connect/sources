/* istanbul ignore file */

// Declarative code
import { Description, Loggable, Trackable } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Loggable(false)
@Trackable()
@Description("Demande identifiée avec le nom d'usage uniquement")
export class RnippFoundOnlyWithMaritalNameException extends RnippBaseException {
  public readonly code = ErrorCode.FOUND_ONLY_WITH_MARITAL_NAME;

  constructor() {
    super(
      'Une erreur est survenue dans la transmission de votre identité. Fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
