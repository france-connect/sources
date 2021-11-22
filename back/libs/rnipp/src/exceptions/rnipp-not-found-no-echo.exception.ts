/* istanbul ignore file */

// Declarative code
import { Description, Loggable, Trackable } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Loggable(false)
@Trackable()
@Description("Le RNIPP n'a pas trouvé l'identité fournie")
export class RnippNotFoundNoEchoException extends RnippBaseException {
  public readonly code = ErrorCode.NOT_FOUND_NO_ECHO;

  constructor() {
    super(
      'Une erreur est survenue dans la transmission de votre identité. Fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
