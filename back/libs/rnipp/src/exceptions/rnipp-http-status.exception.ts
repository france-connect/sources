/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Description(
  "Impossible de joindre le RNIPP. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class RnippHttpStatusException extends RnippBaseException {
  public readonly code = ErrorCode.HTTP_STATUS;
  message = 'Une erreur est survenue dans la transmission de votre identité';

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
