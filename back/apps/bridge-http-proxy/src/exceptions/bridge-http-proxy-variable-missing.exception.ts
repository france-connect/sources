import { ErrorCode } from '../enums';
import { BridgeHttpProxyBaseException } from './bridge-http-proxy-base.exception';

export class BridgeHttpProxyMissingVariableException extends BridgeHttpProxyBaseException {
  static CODE = ErrorCode.MISSING_VARIABLE;
  static DOCUMENTATION =
    'Il manque des variables dans la réponse renvoyée par le broker rabbitmq';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'BridgeHttpProxy.exceptions.bridgeHttpProxyVariableMissing';
}
