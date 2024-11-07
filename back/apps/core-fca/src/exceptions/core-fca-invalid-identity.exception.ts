/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions';

import { CoreFcaBaseException } from './core-fca-base.exception';

const description =
  'Nous ne pouvons pas vérifier votre identité auprès de la source officielle : certains éléments ont un format invalide. Nous vous conseillons de contacter le service informatique de votre organisation ou ministère.';

@Description(description)
export class CoreFcaInvalidIdentityException extends CoreFcaBaseException {
  code = ErrorCode.INVALID_IDENTITY;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;
  public description: string = description;
  public displayContact = true;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
