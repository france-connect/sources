/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_CBE9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CBE9';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'jwtIntrospection is only available in conjuction with introspection';
  static DOCUMENTATION =
    'jwtIntrospection is only available in conjuction with introspection';
  static ERROR_SOURCE = 'helpers/configuration.js:389';
  static UI = 'OidcProvider.exceptions.TypeError.CBE9';
}
