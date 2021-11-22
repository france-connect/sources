/**
 * Centralize error codes for this module.
 *
 * Exception should set their code to one of this enum entry.
 * An entry should be used by one and only one exception.
 *
 * Codes are documented here:
 * @see https://confluence.kaliop.net/display/FC/Codes+erreurs+des+applications
 */
export const enum ErrorCode {
  NOT_FOUND = 1,
  BAD_SESSION_FORMAT = 2,
  BAD_SESSION_ALIAS = 3,
  INVALID_SESSION = 4,
  STORAGE_ISSUE = 5,
  INVALID_CSRF_CONSENT = 6,
  INVALID_CSRF_SELECT_IDP = 7,
  BAD_STRINGIFY = 8,
}
