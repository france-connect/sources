/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_4733_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '4733';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client does not have permission to read its record, 403';
  static DOCUMENTATION =
    'client does not have permission to read its record, 403';
  static ERROR_SOURCE = 'actions/registration.js:160';
  static UI = 'OidcProvider.exceptions.InvalidRequest.4733';
}
