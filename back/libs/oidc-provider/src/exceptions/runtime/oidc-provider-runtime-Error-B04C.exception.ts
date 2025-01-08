/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_B04C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B04C';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'PASETO v3 and v4 tokens are only supported in Node.js >= 16.0.0 runtimes';
  static DOCUMENTATION =
    'PASETO v3 and v4 tokens are only supported in Node.js >= 16.0.0 runtimes';
  static ERROR_SOURCE = 'models/formats/paseto.js:39';
  static UI = 'OidcProvider.exceptions.Error.B04C';
}
