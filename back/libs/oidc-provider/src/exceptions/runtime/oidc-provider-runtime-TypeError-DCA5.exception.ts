/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_DCA5_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DCA5';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'mask can only contain asterisk(*), hyphen-minus(-) and space( ) characters';
  static DOCUMENTATION =
    'mask can only contain asterisk(*), hyphen-minus(-) and space( ) characters';
  static ERROR_SOURCE = 'helpers/configuration.js:479';
  static UI = 'OidcProvider.exceptions.TypeError.DCA5';
}
