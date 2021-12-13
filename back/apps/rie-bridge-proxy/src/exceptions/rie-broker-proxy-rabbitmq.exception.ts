/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RieBrokerProxyBaseException } from './rie-broker-proxy-base.exception';

@Description(
  'Une erreur technique est survenue au moment de la récupération des informations à travers le broker rabbitmq',
)
export class RieBrokerProxyRabbitmqException extends RieBrokerProxyBaseException {
  code = ErrorCode.BROKER_RESPONSE;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
    );
  }
}
