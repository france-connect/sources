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

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
    );
  }
}
