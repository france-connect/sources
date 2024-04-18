/* istanbul ignore file */

// declarative file
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { DataProviderCoreAuthBaseException } from './data-provider-core-auth-base.exception';

@Description('Les scopes du token ne correspondent pas à ceux configurés')
export class ReceivedInvalidScopeException extends DataProviderCoreAuthBaseException {
  code = ErrorCode.INVALID_SCOPE_TOKEN;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.UNAUTHORIZED;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
