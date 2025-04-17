/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_6293_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6293';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    '"profile" must be ${formatters.formatList([...fapiProfiles], { type: "disjunction" })}';
  static DOCUMENTATION =
    '"profile" must be ${formatters.formatList([...fapiProfiles], { type: "disjunction" })}';
  static ERROR_SOURCE = 'helpers/configuration.js:456';
  static UI = 'OidcProvider.exceptions.TypeError.6293';
}
