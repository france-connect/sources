/* istanbul ignore file */

// Declarative code
import { Description, Loggable, Trackable } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Loggable(false)
@Trackable()
@Description(
  "Ce code erreur correspond au RNIPP qui renvoie l'information 'décédée' pour la personne dont l'identité est actuellement redressée. On veut éviter en cas d'erreur d'être trop brutal et d'afficher 'correspond à une personne décédée'",
)
export class RnippDeceasedException extends RnippBaseException {
  public readonly code = ErrorCode.DECEASED;

  constructor() {
    super(
      'Les identifiants utilisés correspondent à une identité qui ne permet plus la connexion.',
    );
  }
}
