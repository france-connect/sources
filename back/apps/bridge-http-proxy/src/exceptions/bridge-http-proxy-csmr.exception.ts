/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';
import { BridgeError } from '@fc/hybridge-http-proxy';

import { ErrorCode } from '../enums';
import { BrigdeHttpProxyBaseException } from './bridge-http-proxy-base.exception';

@Description(
  'Une erreur technique est survenue dans le consumer au moment de la récupération des informations à travers le broker rabbitmq',
)
export class BridgeHttpProxyCsmrException extends BrigdeHttpProxyBaseException {
  code = ErrorCode.CSMR_ERROR;
  reference: number;
  name: string;
  reason: string;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor(error: BridgeError) {
    super(
      'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.',
    );
    const { code: reference, name, reason } = error;
    this.reference = reference;
    this.name = name;
    this.reason = reason;
  }
}
