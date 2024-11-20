/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_BEA9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BEA9';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'only PASETO v3 and v4 tokens support an implicit assertion';
  static DOCUMENTATION =
    'only PASETO v3 and v4 tokens support an implicit assertion';
  static ERROR_SOURCE = 'models/formats/paseto.js:177';
  static UI = 'OidcProvider.exceptions.Error.BEA9';
}
