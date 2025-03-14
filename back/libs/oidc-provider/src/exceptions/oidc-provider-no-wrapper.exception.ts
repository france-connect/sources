import { HttpStatus } from '@nestjs/common';

import { OidcProviderBaseRuntimeException } from './oidc-provider-base-runtime.exception';

export class OidcProviderNoWrapperException extends OidcProviderBaseRuntimeException {
  static CODE = 1;
  static DOCUMENTATION =
    'Une erreur émise par la librairie OIDC Provider de manière dynamique, il est nécessaire de consulter les logs pour en savoir plus.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'OidcProvider.exceptions.OidcProviderNoWrapperException';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
