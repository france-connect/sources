import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

export class CoreFcaInvalidIdentityException extends CoreFcaBaseException {
  static DOCUMENTATION =
    'Nous ne pouvons pas vérifier votre identité auprès de la source officielle : certains éléments ont un format invalide. Nous vous conseillons de contacter le service informatique de votre organisation ou ministère.';
  static CODE = ErrorCode.INVALID_IDENTITY;
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  public description = CoreFcaInvalidIdentityException.DOCUMENTATION;
  public displayContact = true;
}
