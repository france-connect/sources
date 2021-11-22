/* istanbul ignore file */

// Declarative code
/**
 * Centralize error codes for this module.
 *
 * Exception should set their code to one of this enum entry.
 * An entry should be used by one and only one exception.
 *
 * Codes are documented here:
 * @see https://confluence.kaliop.net/display/FC/Codes+erreurs+des+applications
 * @TODO #140 update the upper link to gitlab when page is migrated
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/140
 */
export enum ErrorCode {
  RUNTIME = 0,
  DISABLED_PROVIDER = 17,
  MISSING_PROVIDER = 19,
  MISSING_STATE = 21,
  INVALID_STATE = 22,
  PROVIDER_BLACKLISTED_OR_NON_WHITELISTED = 23,
  BLACLIST_OR_WHITELIST_CHECK_FAILED = 24,
  MISSING_CODE = 25,
  TOKEN_FAILED = 26,
  USERINFOS_FAILED = 27,
  GET_END_SESSION_URL = 28,
}
