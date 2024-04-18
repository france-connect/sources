/**
 * Centralize error codes for this module.
 *
 * Exception should set their code to one of this enum entry.
 * An entry should be used by one and only one exception.
 *
 * Codes are documented here:
 * @see ../../../../back/_doc/erreurs.md
 */
export const enum ErrorCode {
  NOT_FOUND = 1,
  BAD_SESSION_FORMAT = 2,
  BAD_SESSION_ALIAS = 3,
  INVALID_SESSION = 4,
  STORAGE_ISSUE = 5,
  BAD_STRINGIFY = 8,
  NO_SESSION_ID = 9,
  SUB_NOT_FOUND = 10,
  INVALID_DATA = 11,
  BAD_COOKIE = 12,
  CANNOT_COMMIT = 13,
}
