/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

@Description(
  'Le FI est désactivé, si le problème persiste, contacter le support AgentConnect',
)
export class CoreFcaAgentIdpDisabledException extends CoreFcaBaseException {
  code = ErrorCode.DISABLED_PROVIDER;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  illustration = 'temporary-restricted-error';
  title = 'Accès indisponible';
  description =
    'Un incident technique est en cours. Merci de revenir plus tard.';

  public displayContact = false;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
