/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

@Description("Le compte de l’agent.e n'est plus actif.")
export class CoreFcaAgentAccountBlockedException extends CoreFcaBaseException {
  code = ErrorCode.BLOCKED_ACCOUNT;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  illustration = 'access-restricted-error';
  title = 'Accès impossible';
  public description =
    "Votre compte n'est plus actif, vous ne pouvez pas accéder au service demandé.";

  public displayContact = false;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'authentication aborted due to invalid identity';
}
