/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_3D7C_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '3D7C';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    'Request Object is not a valid ${parts.length === 5 ? JWE : JWT}';
  static DOCUMENTATION =
    'Request Object is not a valid ${parts.length === 5 ? JWE : JWT}';
  static ERROR_SOURCE = 'actions/authorization/check_client.js:64';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.3D7C';
}
