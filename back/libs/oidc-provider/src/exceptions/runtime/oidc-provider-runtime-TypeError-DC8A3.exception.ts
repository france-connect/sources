/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_DC8A3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DC8A3';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'richAuthorizationRequests is only available in conjuction with enabled resourceIndicators';
  static DOCUMENTATION =
    'richAuthorizationRequests is only available in conjuction with enabled resourceIndicators';
  static ERROR_SOURCE = 'helpers/configuration.js:364';
  static UI = 'OidcProvider.exceptions.TypeError.DC8A3';
}
