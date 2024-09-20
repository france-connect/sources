/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Description(
  "Ce code erreur correspond au RNIPP qui renvoie l'information 'décédée' pour la personne dont l'identité est actuellement redressée. On veut éviter en cas d'erreur d'être trop brutal et d'afficher 'correspond à une personne décédée'",
)
export class RnippDeceasedException extends RnippBaseException {
  public readonly code = ErrorCode.DECEASED;
  public readonly message =
    'Les identifiants utilisés correspondent à une identité qui ne permet plus la connexion.';
  public readonly httpStatusCode = HttpStatus.FORBIDDEN;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
}
