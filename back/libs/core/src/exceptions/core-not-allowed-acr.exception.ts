/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(`Le niveau eidas renvoyé par le FI n'est pas autorisé pour ce FI`)
export class CoreNotAllowedAcrException extends CoreBaseException {
  scope = 2; // identity provider scope
  code = ErrorCode.NOT_ALLOWED_ACR;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'idp returned a not allowed acr value';
}
