/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

export class CoreFcaAgentIdpDisabledException extends CoreFcaBaseException {
  static CODE = ErrorCode.DISABLED_PROVIDER;
  static DOCUMENTATION =
    'Le FI est désactivé, si le problème persiste, contacter le support ProConnect';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  public illustration = 'temporary-restricted-error';
  public title = 'Accès indisponible';
  public description =
    'Un incident technique est en cours. Merci de revenir plus tard.';

  public displayContact = false;
}
