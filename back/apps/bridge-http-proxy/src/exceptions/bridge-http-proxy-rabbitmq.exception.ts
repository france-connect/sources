/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { BrigdeHttpProxyBaseException } from './bridge-http-proxy-base.exception';

@Description(
  'Une erreur technique est survenue au moment de la récupération des informations à travers le broker rabbitmq',
)
export class BridgeHttpProxyRabbitmqException extends BrigdeHttpProxyBaseException {
  code = ErrorCode.BROKER_RESPONSE;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
