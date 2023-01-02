/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "Une erreur est survenue lors de la récupération des données d'identité aurès du FI. Recommencer la cinématique depuis le FS. Si le problème persiste, contacter le support N3",
)
export class OidcClientUserinfosFailedException extends OidcClientBaseException {
  code = ErrorCode.USERINFOS_FAILED;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
