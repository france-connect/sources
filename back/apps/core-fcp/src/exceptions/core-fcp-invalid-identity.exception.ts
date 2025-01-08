import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreFcpBaseException } from './core-fcp-base.exception';

export class CoreFcpInvalidIdentityException extends CoreFcpBaseException {
  static CODE = ErrorCode.INVALID_IDENTITY;
  static DOCUMENTATION =
    "La session de l'utilisateur ne contient pas les informations attendes sur l'usager au retour du fournisseur d'identité. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'CoreFcp.exceptions.coreFcpInvalidIdentity';
}
