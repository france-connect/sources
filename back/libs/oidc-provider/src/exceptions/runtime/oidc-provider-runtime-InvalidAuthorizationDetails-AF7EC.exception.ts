/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidAuthorizationDetails_AF7EC_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AF7EC';
  static ERROR_CLASS = 'InvalidAuthorizationDetails';
  static ERROR_DETAIL =
    'authorization_details parameter members" type attribute must be a non-empty string (authorization details index ${i})';
  static DOCUMENTATION =
    'authorization_details parameter members" type attribute must be a non-empty string (authorization details index ${i})';
  static ERROR_SOURCE = 'shared/check_rar.js:44';
  static UI = 'OidcProvider.exceptions.InvalidAuthorizationDetails.AF7EC';
}
