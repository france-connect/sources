/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

@Description(
  'Impossible pour le fournisseur de données de joindre le JWKS du core',
)
export class JwksFetchFailedException extends ChecktokenBaseException {
  message = 'Can not fetch jwks';
  code = ErrorCode.JWKS_FETCH_FAILED_EXCEPTION;
}
