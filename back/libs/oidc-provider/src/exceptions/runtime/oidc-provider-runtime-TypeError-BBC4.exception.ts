/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_BBC4_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BBC4';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = '"filter" must be an instance of Set';
  static DOCUMENTATION = '"filter" must be an instance of Set';
  static ERROR_SOURCE = 'models/grant.js:205';
  static UI = 'OidcProvider.exceptions.TypeError.BBC4';
}
