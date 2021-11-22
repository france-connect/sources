/* istanbul ignore file */

// declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  "L'identifiant de session n'est pas valide, il n'est pas possible de trouver une session correspondante. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class SessionBadAliasException extends SessionBaseException {
  public readonly code = ErrorCode.BAD_SESSION_ALIAS;

  constructor() {
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
