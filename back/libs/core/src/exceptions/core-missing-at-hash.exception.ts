import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

export class CoreMissingAtHashException extends CoreBaseException {
  static CODE = ErrorCode.MISSING_AT_HASH;
  static DOCUMENTATION =
    "Le claim at_hash n'a pas été trouvé dans l'id_token_hint lors du logout";
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'Core.exceptions.coreMissingAtHash';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'Core.exceptions.coreMissingAtHash';
}
