import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { OidcProviderBaseRenderedException } from './oidc-provider-base-rendered.exception';

export class OidcProviderNoWrapperException extends OidcProviderBaseRenderedException {
  static CODE = ErrorCode.NO_WRAPPER;
  static DOCUMENTATION =
    'Une erreur émise par la librairie OIDC Provider de manière dynamique, il est nécessaire de consulter les logs pour en savoir plus.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'OidcProvider.exceptions.OidcProviderNoWrapperException';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
