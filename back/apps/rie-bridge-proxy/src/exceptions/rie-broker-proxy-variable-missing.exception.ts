/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { RieBrokerProxyBaseException } from './rie-broker-proxy-base.exception';

@Description(
  'Il manque des variables dans la réponse renvoyée par le broker rabbitmq',
)
export class RieBrokerProxyMissingVariableException extends RieBrokerProxyBaseException {
  code = ErrorCode.MISSING_VARIABLE;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
    );
  }
}
