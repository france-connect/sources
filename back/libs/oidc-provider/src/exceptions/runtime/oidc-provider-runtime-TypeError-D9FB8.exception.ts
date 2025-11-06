/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_D9FB8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D9FB8';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'unsupported encrypted request alg';
  static DOCUMENTATION = 'unsupported encrypted request alg';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:46';
  static UI = 'OidcProvider.exceptions.TypeError.D9FB8';
}
