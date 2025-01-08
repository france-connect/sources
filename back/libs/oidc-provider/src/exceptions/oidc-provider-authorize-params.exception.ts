import { HttpStatus } from '@nestjs/common';

import { FcException } from '@fc/exceptions';

import { ErrorCode } from '../enums';

export class OidcProviderAuthorizeParamsException extends FcException {
  static SCOPE = 3;

  static CODE = ErrorCode.AUTHORIZATION_ERROR;
  static DOCUMENTATION =
    "Un ou plusieurs `params` de la route `authorize` n'a/ont pas été validé par le DTO";
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'invalid parameter';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'OidcProvider.exceptions.oidcProviderAuthorizeParams';
}
