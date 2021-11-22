/* istanbul ignore file */

// declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

@Description(
  "Erreur émise lorsque l'usager n'a plus de session, probablement une fenêtre restée ouverte au delà des 10 minutes. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class SessionNotFoundException extends SessionBaseException {
  public readonly code = ErrorCode.NOT_FOUND;

  /* eslint-disable @typescript-eslint/no-unused-vars */
  constructor(param: string) {
    // param désactivé car pas utilisé dans le message usager.
    // En revanche il est passé dans le code et laissé en param ici
    // car il sera potentiellement utilisé pour le message pour les développeurs
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
