/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

@Description(
  "Erreur de communication avec le RNIPP (pas de réponse du RNIPP). L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class RnippTimeoutException extends RnippBaseException {
  public readonly code = ErrorCode.REQUEST_TIMEOUT;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
