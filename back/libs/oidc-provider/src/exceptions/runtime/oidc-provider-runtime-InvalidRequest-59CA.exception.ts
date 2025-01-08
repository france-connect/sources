/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_59CA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '59CA';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'multiple proof-of-posession mechanisms are not allowed';
  static DOCUMENTATION =
    'multiple proof-of-posession mechanisms are not allowed';
  static ERROR_SOURCE = 'models/mixins/is_sender_constrained.js:20';
  static UI = 'OidcProvider.exceptions.InvalidRequest.59CA';
}
