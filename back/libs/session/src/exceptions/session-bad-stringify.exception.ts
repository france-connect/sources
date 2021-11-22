/* istanbul ignore file */

// declarative code
import { Description, Loggable } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  "Les données pour la session se sont mal formatées avant d'être chiffrées. Si le problème persiste, contacter le support N3",
)
@Loggable()
export class SessionBadStringifyException extends SessionBaseException {
  public readonly code = ErrorCode.BAD_STRINGIFY;

  constructor() {
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
