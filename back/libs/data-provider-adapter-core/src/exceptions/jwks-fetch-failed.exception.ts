/* istanbul ignore file */

// Declarative file

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

export class JwksFetchFailedException extends ChecktokenBaseException {
  static CODE = ErrorCode.JWKS_FETCH_FAILED_EXCEPTION;
  static DOCUMENTATION =
    'Impossible pour le fournisseur de données de joindre le JWKS du core';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'DataProviderAdapterCore.exceptions.jwksFetchFailed';
}
