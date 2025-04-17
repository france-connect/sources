/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequestObject_4E24_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4E24';
  static ERROR_CLASS = 'InvalidRequestObject';
  static ERROR_DETAIL =
    'Request Object from insecure request_uri must be signed and/or symmetrically encrypted';
  static DOCUMENTATION =
    'Request Object from insecure request_uri must be signed and/or symmetrically encrypted';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:196';
  static UI = 'OidcProvider.exceptions.InvalidRequestObject.4E24';
}
