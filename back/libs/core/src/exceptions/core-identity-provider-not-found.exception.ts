/* istanbul ignore file */

// Declarative file
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description("Le fournisseur d'identité n'a pas été trouvé.")
export class CoreIdentityProviderNotFoundException extends CoreBaseException {
  code = ErrorCode.IDENTITY_PROVIDER_NOT_FOUND;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
