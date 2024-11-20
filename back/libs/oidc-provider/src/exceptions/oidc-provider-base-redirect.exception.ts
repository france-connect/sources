/* istanbul ignore file */

// Declarative file
import { HttpStatus } from '@nestjs/common';

import { OidcProviderBaseException } from './oidc-provider-base.exception';

export class OidcProviderBaseRedirectException extends OidcProviderBaseException {
  static ERROR: string;
  static ERROR_DESCRIPTION: string;
  static HTTP_STATUS_CODE = HttpStatus.SEE_OTHER;
}
