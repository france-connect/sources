/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_CBC6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CBC6';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'only supported clientAuthMethods are ${formatters.formatList([...authMethods])}';
  static DOCUMENTATION =
    'only supported clientAuthMethods are ${formatters.formatList([...authMethods])}';
  static ERROR_SOURCE = 'helpers/configuration.js:494';
  static UI = 'OidcProvider.exceptions.TypeError.CBC6';
}
