import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

export class CoreIdentityProviderNotFoundException extends CoreBaseException {
  static CODE = ErrorCode.IDENTITY_PROVIDER_NOT_FOUND;
  static DOCUMENTATION = "Le fournisseur d'identité n'a pas été trouvé.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'Core.exceptions.coreIdentityProviderNotFound';
}
