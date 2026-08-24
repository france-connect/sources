import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { EudiCogBaseException } from './eudi-cog-base.exception';

export class EudiCogInvalidResolverNameException extends EudiCogBaseException {
  static CODE = ErrorCode.INVALID_RESOLVER_NAME;
  static DOCUMENTATION =
    'Le resolver demandé est inconnu (erreur dans le code).';
  static UI = 'EudiCog.exceptions.EudiCogInvalidResolverNameException';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
}
