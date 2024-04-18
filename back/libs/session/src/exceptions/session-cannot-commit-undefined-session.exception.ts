/* istanbul ignore file */

// declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  "La session n'a pas été trouvé au moment ou elle aurait due être sauvegardée. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class SessionCannotCommitUndefinedSession extends SessionBaseException {
  public readonly code = ErrorCode.CANNOT_COMMIT;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';

  constructor() {
    super(
      'Votre session a expiré, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
