/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { BrigdeHttpProxyBaseException } from './bridge-http-proxy-base.exception';

@Description(
  'Il manque des variables dans la réponse renvoyée par le broker rabbitmq',
)
export class BridgeHttpProxyMissingVariableException extends BrigdeHttpProxyBaseException {
  code = ErrorCode.MISSING_VARIABLE;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
