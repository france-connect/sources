/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Description(
  "Erreur de communication avec le RNIPP (demande rejetée par le RNIPP). L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class RnippRejectedBadRequestException extends RnippBaseException {
  public readonly code = ErrorCode.REJECTED_BAD_REQUEST;

  constructor() {
    super(
      'Une erreur est survenue dans la transmission de votre identité. Fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
