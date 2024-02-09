/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  `Le claim AMR demandé n'est pas autorisé pour le service provider.`,
)
export class CoreClaimAmrException extends CoreBaseException {
  scope = 3;
  code = ErrorCode.CLAIM_AMR;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
    );
  }
}
