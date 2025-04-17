/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_D7DA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D7DA';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'mask can only contain asterisk("*"), hyphen-minus("-") and space(" ") characters';
  static DOCUMENTATION =
    'mask can only contain asterisk("*"), hyphen-minus("-") and space(" ") characters';
  static ERROR_SOURCE = 'helpers/configuration.js:508';
  static UI = 'OidcProvider.exceptions.TypeError.D7DA';
}
