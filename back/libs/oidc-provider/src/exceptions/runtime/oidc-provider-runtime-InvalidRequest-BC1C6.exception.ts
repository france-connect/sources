/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidRequest_BC1C6_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BC1C6';
  static ERROR_CLASS = 'InvalidRequest';
  static ERROR_DETAIL =
    'multiple proof-of-posession mechanisms are not allowed';
  static DOCUMENTATION =
    'multiple proof-of-posession mechanisms are not allowed';
  static ERROR_SOURCE = 'models/mixins/is_sender_constrained.js:26';
  static UI = 'OidcProvider.exceptions.InvalidRequest.BC1C6';
}
