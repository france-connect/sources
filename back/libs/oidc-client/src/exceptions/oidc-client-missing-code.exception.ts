/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "La requête reçue au retour du FI n'est pas valide (pas de code d'autorisation), recommencer la cinématique depuis le FS. Si le problème persiste, contacter le support N3",
)
export class OidcClientMissingCodeException extends OidcClientBaseException {
  code = ErrorCode.MISSING_CODE;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;
}
