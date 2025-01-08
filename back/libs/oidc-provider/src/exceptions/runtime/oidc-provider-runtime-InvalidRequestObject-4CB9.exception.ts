/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_4CB9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4CB9';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL = 'request replay detected (jti: ${payload.jti})';
  static DOCUMENTATION = 'request replay detected (jti: ${payload.jti})';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:238';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.4CB9';
}
