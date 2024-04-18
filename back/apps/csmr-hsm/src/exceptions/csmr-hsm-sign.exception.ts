import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { CsmrHsmBaseException } from './csmr-hsm-base.exception';

/* istanbul ignore file */

// Declarative code
@Description(
  "Une erreur s'est produite lors de la signature d'un token par le HSM. Contacter le support N3. Cette erreur n'est normalement pas remontée aux utilisateurs",
)
export class CsmrHsmSignException extends CsmrHsmBaseException {
  code = ErrorCode.HSM_SIGNATURE;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
