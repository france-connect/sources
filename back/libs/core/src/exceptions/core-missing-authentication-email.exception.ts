/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  "Un problème de configuration concernant l'envoi du mail de notification est survenue. Contacter le support N3 de toute urgence.",
)
export class CoreMissingAuthenticationEmailException extends CoreBaseException {
  code = ErrorCode.MISSING_AUTHENTICATION_EMAIL;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support');
  }
}
