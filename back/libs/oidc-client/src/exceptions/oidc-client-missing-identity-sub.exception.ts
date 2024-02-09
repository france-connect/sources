/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "Une erreur est survenu lors de la récupération des jetons auprès du fournisseur d'identité. Les données renvoyées lors de l'appel au /userinfo du FI sont incorrectes et n'ont pas pu être validées. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class OidcClientMissingIdentitySubException extends OidcClientBaseException {
  code = ErrorCode.MISSING_IDENTITY_SUB;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
