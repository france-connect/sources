/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_A477_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A477';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'registration policies are only available in conjuction with adapter-backed initial access tokens';
  static DOCUMENTATION =
    'registration policies are only available in conjuction with adapter-backed initial access tokens';
  static ERROR_SOURCE = 'helpers/configuration.js:387';
  static UI = 'OidcProvider.exceptions.TypeError.A477';
}
