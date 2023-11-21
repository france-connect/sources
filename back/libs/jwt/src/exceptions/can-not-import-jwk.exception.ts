/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description("Impossible d'importer le JWK")
export class CanNotImportJwkException extends JwtBaseException {
  code = ErrorCode.CAN_NOT_IMPORT_JWK;
  message = 'Can not import JWK';
}
