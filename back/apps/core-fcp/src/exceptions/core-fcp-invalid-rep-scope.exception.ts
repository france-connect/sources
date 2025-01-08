import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreFcpBaseException } from './core-fcp-base.exception';

export class CoreFcpInvalidRepScopeException extends CoreFcpBaseException {
  static CODE = ErrorCode.INVALID_REP_SCOPE;
  static DOCUMENTATION =
    'Le mandat sélectionné ne contient pas les autorisations nécessaires à la connexion sur ce service. Vous pouvez recommencer la connexion avec un mandat présentant les autorisations nécessaires. Si cela persiste, contacter le support N3';
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'CoreFcp.exceptions.coreFcpInvalidRepScope';
}
