/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

export class InvalidChecktokenRequestException extends CoreBaseException {
  static CODE = ErrorCode.IDENTITY_CHECK_TOKEN;
  static DOCUMENTATION =
    "La requête reçue pour vérifier le token n'est pas valide. Des paramètres obligatoires sont manquants ou au mauvais format.";

  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'Required parameter missing or invalid.';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'Core.exceptions.coreInvalidCheckTokenRequest';
}
