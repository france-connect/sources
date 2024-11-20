/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

export class OidcClientUserinfosFailedException extends OidcClientBaseException {
  static CODE = ErrorCode.USERINFOS_FAILED;
  static DOCUMENTATION =
    "Une erreur est survenue lors de la récupération des données d'identité aurès du FI. Recommencer la cinématique depuis le FS. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_GATEWAY;
  static UI = 'OidcClient.exceptions.oidcClientUserinfosFailed';
}
