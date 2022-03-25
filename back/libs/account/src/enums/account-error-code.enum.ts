/**
 * Centralize error codes for this module.
 *
 * Exception should set their code to one of this enum entry.
 * An entry should be used by one and only one exception.
 *
 * Codes are documented here:
 * @see ../../../../back/_doc/erreurs.md
 */
export enum ErrorCode {
  ACCOUNT_BLOCKED = 1,
  ACCOUNT_NOT_FOUND = 2,
}
