/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_BB74_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BB74';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'richAuthorizationRequests is only available in conjuction with enabled resourceIndicators';
  static DOCUMENTATION =
    'richAuthorizationRequests is only available in conjuction with enabled resourceIndicators';
  static ERROR_SOURCE = 'helpers/configuration.js:408';
  static UI = 'OidcProvider.exceptions.TypeError.BB74';
}
