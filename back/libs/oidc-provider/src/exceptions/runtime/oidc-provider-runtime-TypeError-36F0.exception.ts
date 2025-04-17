/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_36F0_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '36F0';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'invalid type for enabledJWA.${key} provided, expected Array';
  static DOCUMENTATION =
    'invalid type for enabledJWA.${key} provided, expected Array';
  static ERROR_SOURCE = 'helpers/configuration.js:273';
  static UI = 'OidcProvider.exceptions.TypeError.36F0';
}
