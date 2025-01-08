/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_F0AE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F0AE';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'resolved Resource Server jwt configuration has no corresponding key in the providers keystore';
  static DOCUMENTATION =
    'resolved Resource Server jwt configuration has no corresponding key in the providers keystore';
  static ERROR_SOURCE = 'models/formats/jwt.js:49';
  static UI = 'OidcProvider.exceptions.Error.F0AE';
}
