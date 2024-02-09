/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "La requête reçue au retour du FI n'est pas valide (le code d'autorisation est présent mais n'est pas reconnu par le FI), recommencer la cinématique depuis le FS. Si le problème persiste, contacter le support N3",
)
export class OidcClientTokenFailedException extends OidcClientBaseException {
  code = ErrorCode.TOKEN_FAILED;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.BAD_GATEWAY;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
