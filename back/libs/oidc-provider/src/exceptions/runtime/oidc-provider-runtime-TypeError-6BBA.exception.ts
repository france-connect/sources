/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_6BBA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6BBA';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = '"dnsLookup" http request option must be a function';
  static DOCUMENTATION = '"dnsLookup" http request option must be a function';
  static ERROR_SOURCE = 'helpers/request.js:35';
  static UI = 'OidcProvider.exceptions.TypeError.6BBA';
}
