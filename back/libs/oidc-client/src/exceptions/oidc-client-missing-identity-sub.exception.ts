import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

export class OidcClientMissingIdentitySubException extends OidcClientBaseException {
  static CODE = ErrorCode.MISSING_IDENTITY_SUB;
  static DOCUMENTATION =
    "Une erreur est survenu lors de la récupération des jetons auprès du fournisseur d'identité. Les données renvoyées lors de l'appel au /userinfo du FI sont incorrectes et n'ont pas pu être validées. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
  static UI = 'OidcClient.exceptions.oidcClientMissingIdentitySub';
}
