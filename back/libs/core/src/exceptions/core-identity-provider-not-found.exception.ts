/* istanbul ignore file */

import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

// Declarative file
export class CoreIdentityProviderNotFoundException extends CoreBaseException {
  code = ErrorCode.IDENTITY_PROVIDER_NOT_FOUND;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;
}
