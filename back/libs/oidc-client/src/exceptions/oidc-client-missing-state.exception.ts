/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "La requête reçue au retour du FI n'est pas valide (pas de state), problème probable avec le FI, contacter le support N3",
)
export class OidcClientMissingStateException extends OidcClientBaseException {
  code = ErrorCode.MISSING_STATE;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
