/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_EB45_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'EB45';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'only plain and S256 code challenge methods are supported';
  static DOCUMENTATION =
    'only plain and S256 code challenge methods are supported';
  static ERROR_SOURCE = 'helpers/configuration.js:363';
  static UI = 'OidcProvider.exceptions.TypeError.EB45';
}
