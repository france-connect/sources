import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockServiceProviderBaseException } from './mock-service-provider-base.exception';

export class MockServiceProviderAuthException extends MockServiceProviderBaseException {
  static CODE = ErrorCode.AUTH;
  static DOCUMENTATION = "L'usager n'est pas authentifié";
  static HTTP_STATUS_CODE: HttpStatus.UNAUTHORIZED;
  static UI = 'MockServiceProvider.exceptions.mockServiceProviderAuth';
}
