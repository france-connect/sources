/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_AFB9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AFB9';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'only plain and S256 code challenge methods are supported';
  static DOCUMENTATION =
    'only plain and S256 code challenge methods are supported';
  static ERROR_SOURCE = 'helpers/configuration.js:377';
  static UI = 'OidcProvider.exceptions.TypeError.AFB9';
}
