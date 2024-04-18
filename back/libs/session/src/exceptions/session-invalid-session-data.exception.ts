/* istanbul ignore file */

// declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  "La Session récupérée en base n'est pas valide'. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class SessionInvalidSessionDataException extends SessionBaseException {
  public readonly code = ErrorCode.INVALID_DATA;
  public readonly httpStatusCode = HttpStatus.CONFLICT;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';

  constructor() {
    super(
      'Votre session est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
