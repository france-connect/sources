/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  `Le niveau eIDAS renvoyé par le FI est plus faible que celui demandé par le FS. L'utilisateur doit recommencer la cinématique. Si le problème persiste, contacter le support N3`,
)
export class CoreLowAcrException extends CoreBaseException {
  scope = 2; // identity provider scope
  code = ErrorCode.LOW_ACR;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  // should not happen as we display only valid identity providers on user's ip choice page
  public readonly httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
