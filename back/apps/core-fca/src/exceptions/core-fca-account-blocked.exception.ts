import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

export class CoreFcaAgentAccountBlockedException extends CoreFcaBaseException {
  static DOCUMENTATION = "Le compte de l’agent.e n'est plus actif.";
  static CODE = ErrorCode.BLOCKED_ACCOUNT;
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'authentication aborted due to invalid identity';

  public illustration = 'access-restricted-error';
  public title = 'Accès impossible';
  public description =
    "Votre compte n'est plus actif, vous ne pouvez pas accéder au service demandé.";

  public displayContact = false;
}
