/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippFoundOnlyWithMaritalNameException extends RnippBaseException {
  static CODE = ErrorCode.FOUND_ONLY_WITH_MARITAL_NAME;
  static DOCUMENTATION = "Demande identifiée avec le nom d'usage uniquement";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
  static UI = 'Rnipp.exceptions.rnippFoundOnlyWithMaritalName';
}
