import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

export class OidcClientTokenFailedException extends OidcClientBaseException {
  static CODE = ErrorCode.TOKEN_FAILED;
  static DOCUMENTATION =
    "La requête reçue au retour du FI n'est pas valide (le code d'autorisation est présent mais n'est pas reconnu par le FI), recommencer la cinématique depuis le FS. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_GATEWAY;
  static UI = 'OidcClient.exceptions.oidcClientTokenFailed';
}
