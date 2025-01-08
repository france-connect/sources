/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_C008_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C008';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'only supported ${endpoint}EndpointAuthMethods are ${formatters.formatList([...authMethods])}';
  static DOCUMENTATION =
    'only supported ${endpoint}EndpointAuthMethods are ${formatters.formatList([...authMethods])}';
  static ERROR_SOURCE = 'helpers/configuration.js:464';
  static UI = 'OidcProvider.exceptions.TypeError.C008';
}
