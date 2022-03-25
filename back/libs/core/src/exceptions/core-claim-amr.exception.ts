/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  `Le claim AMR demandé n'est pas autorisé pour le service provider.`,
)
export class CoreClaimAmrException extends CoreBaseException {
  scope = 3;
  code = ErrorCode.CLAIM_AMR;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
    );
  }
}
