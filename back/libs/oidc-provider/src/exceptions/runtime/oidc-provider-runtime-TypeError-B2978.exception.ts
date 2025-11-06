/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_B2978_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'B2978';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'features.dPoP.nonceSecret must be a 32-byte Buffer instance';
  static DOCUMENTATION =
    'features.dPoP.nonceSecret must be a 32-byte Buffer instance';
  static ERROR_SOURCE = 'helpers/dpop_nonces.js:59';
  static UI = 'OidcProvider.exceptions.TypeError.B2978';
}
