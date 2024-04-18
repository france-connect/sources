/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  "Le claim at_hash n'a pas été trouvé dans l'id_token_hint lors du logout",
)
export class CoreMissingAtHashException extends CoreBaseException {
  code = ErrorCode.MISSING_AT_HASH;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'Missing at_hash claim in id_token_hint';

  constructor() {
    super('Missing at_hash claim in id_token_hint');
  }
}
