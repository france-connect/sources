/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_A33DE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A33DE';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'client does not have permission to read its record, 403';
  static DOCUMENTATION =
    'client does not have permission to read its record, 403';
  static ERROR_SOURCE = 'actions/registration.js:176';
  static UI = 'OidcProvider.exceptions.InvalidRequest.A33DE';
}
