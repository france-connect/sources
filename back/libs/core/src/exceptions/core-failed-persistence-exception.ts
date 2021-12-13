/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  `L'enregistrement de l'Account en base de donnée a échoué. Ce cas est anormal, il faut prévenir l'équipe technique.`,
)
export class CoreFailedPersistenceException extends CoreBaseException {
  code = ErrorCode.FAILED_PERSISTENCE;
  message =
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';
}
