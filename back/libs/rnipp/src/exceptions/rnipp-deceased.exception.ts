/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippDeceasedException extends RnippBaseException {
  static CODE = ErrorCode.DECEASED;
  static DOCUMENTATION =
    "Ce code erreur correspond au RNIPP qui renvoie l'information 'décédée' pour la personne dont l'identité est actuellement redressée. On veut éviter en cas d'erreur d'être trop brutal et d'afficher 'correspond à une personne décédée'";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
  static UI = 'Rnipp.exceptions.rnippDeceased';
}
