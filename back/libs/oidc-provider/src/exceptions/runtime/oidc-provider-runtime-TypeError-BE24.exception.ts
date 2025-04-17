/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_BE24_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BE24';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'unsupported encrypted request alg';
  static DOCUMENTATION = 'unsupported encrypted request alg';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:47';
  static UI = 'OidcProvider.exceptions.TypeError.BE24';
}
