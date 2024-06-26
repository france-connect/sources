/* istanbul ignore file */

// declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  "Les éléments présents dans la session de l'utilisateur ne sont pas valides. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class SessionBadFormatException extends SessionBaseException {
  public readonly code = ErrorCode.BAD_SESSION_FORMAT;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';

  constructor() {
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
