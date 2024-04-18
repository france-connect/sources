/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

@Description(
  'Impossible pour le fournisseur de données de joindre le JWKS du core',
)
export class JwksFetchFailedException extends ChecktokenBaseException {
  message = 'Can not fetch jwks';
  code = ErrorCode.JWKS_FETCH_FAILED_EXCEPTION;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
