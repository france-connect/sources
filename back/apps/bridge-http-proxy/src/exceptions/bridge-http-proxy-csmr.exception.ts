import { BridgeError } from '@fc/hybridge-http-proxy';

import { ErrorCode } from '../enums';
import { BridgeHttpProxyBaseException } from './bridge-http-proxy-base.exception';

export class BridgeHttpProxyCsmrException extends BridgeHttpProxyBaseException {
  static CODE = ErrorCode.CSMR_ERROR;
  static DOCUMENTATION =
    'Une erreur technique est survenue dans le consumer au moment de la récupération des informations à travers le broker rabbitmq';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'BridgeHttpProxy.exceptions.bridgeHttpProxyCsmr';

  public reference: number;
  public name: string;
  public reason: string;

  constructor(error: BridgeError) {
    super();
    const { code: reference, name, reason } = error;
    this.reference = reference;
    this.name = name;
    this.reason = reason;
  }
}
