/* istanbul ignore file */

// Declarative code
import { Description, Loggable, Trackable } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Loggable(false)
@Trackable()
@Description(
  "Le RNIPP a trouvé un echo mais pas suffisamment proche de l'identité demandée",
)
export class RnippNotFoundSingleEchoException extends RnippBaseException {
  public readonly code = ErrorCode.NOT_FOUND_SINGLE_ECHO;

  constructor() {
    super(
      'Une erreur est survenue dans la transmission de votre identité. Fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
