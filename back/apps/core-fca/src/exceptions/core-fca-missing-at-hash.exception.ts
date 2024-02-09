/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { CoreBaseException } from '@fc/core';
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';

@Description(
  "Le claim at_hash n'a pas été trouvé dans l'id_token_hint lors du logout",
)
export class CoreFcaMissingAtHashException extends CoreBaseException {
  code = ErrorCode.MISSING_AT_HASH;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'Missing at_hash claim in id_token_hint';

  constructor() {
    super('Missing at_hash claim in id_token_hint');
  }
}
