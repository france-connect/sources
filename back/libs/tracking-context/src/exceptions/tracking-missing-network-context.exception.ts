/* istanbul ignore file */

// Declarative file
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { TrackingBaseException } from './tracking-base.exception';

@Description(
  "L'application n'a pas trouvé de headers dans l'objet request, c'est probablement un bug, Contacter le support N3",
)
export class TrackingMissingNetworkContextException extends TrackingBaseException {
  public readonly message = 'Missing network context (headers)';
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;
  public readonly code = ErrorCode.MISSING_HEADERS;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
