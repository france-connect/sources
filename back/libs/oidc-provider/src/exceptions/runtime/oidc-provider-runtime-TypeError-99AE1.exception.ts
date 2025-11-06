/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_99AE1_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '99AE1';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'registration policies are only available in conjuction with adapter-backed initial access tokens';
  static DOCUMENTATION =
    'registration policies are only available in conjuction with adapter-backed initial access tokens';
  static ERROR_SOURCE = 'helpers/configuration.js:360';
  static UI = 'OidcProvider.exceptions.TypeError.99AE1';
}
