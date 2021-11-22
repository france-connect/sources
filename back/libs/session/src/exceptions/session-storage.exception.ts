/* istanbul ignore file */

// declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  'Un problème est survenant lors de la récupération des données de session dans la base Redis. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3',
)
export class SessionStorageException extends SessionBaseException {
  public readonly code = ErrorCode.STORAGE_ISSUE;

  constructor() {
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous. Si le problème persiste, contacter le support',
    );
  }
}
