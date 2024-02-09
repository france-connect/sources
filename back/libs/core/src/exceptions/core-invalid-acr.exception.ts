/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  `Le niveau eidas demandé par le FS ou renvoyé par le FI n'est pas supporté par la plateforme`,
)
export class CoreInvalidAcrException extends CoreBaseException {
  scope = 2; // identity provider scope
  code = ErrorCode.INVALID_ACR;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'acr_values ​​not supported';
}
