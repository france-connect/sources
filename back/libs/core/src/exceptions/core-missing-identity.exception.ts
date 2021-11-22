/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  "Des étapes de la cinématique ont été omises (identité non disponible en session, l'usager doit redémarrer sa cinématique depuis le FS)",
)
export class CoreMissingIdentityException extends CoreBaseException {
  code = ErrorCode.MISSING_IDENTITY;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
