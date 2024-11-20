/* istanbul ignore file */

// Declarative code

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

export class CoreFailedPersistenceException extends CoreBaseException {
  static CODE = ErrorCode.FAILED_PERSISTENCE;
  static DOCUMENTATION = `L'enregistrement de l'Account en base de donnée a échoué. Ce cas est anormal, il faut prévenir l'équipe technique.`;
  static UI =
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';
}
