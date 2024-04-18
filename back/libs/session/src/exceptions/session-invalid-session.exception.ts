/* istanbul ignore file */

// declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { SessionBaseException } from './session-base.exception';

/**
 * @todo #587
 * author: Olivier D.
 * Date: 21/06/2021
 * Context: Volonté d'ajouter une description pour le support, un message pour les usagers.
 * Vérifier la pertinence de cette erreur qui n'est pour le moment pas levée
 */

@Description(
  "La Session n'est pas valide'. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class SessionInvalidSessionException extends SessionBaseException {
  public readonly code = ErrorCode.INVALID_SESSION;
  public readonly httpStatusCode = HttpStatus.CONFLICT;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';

  constructor() {
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
