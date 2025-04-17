/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_7DFB_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7DFB';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'features.dPoP.nonceSecret must be a 32-byte Buffer instance';
  static DOCUMENTATION =
    'features.dPoP.nonceSecret must be a 32-byte Buffer instance';
  static ERROR_SOURCE = 'helpers/dpop_nonces.js:55';
  static UI = 'OidcProvider.exceptions.TypeError.7DFB';
}
