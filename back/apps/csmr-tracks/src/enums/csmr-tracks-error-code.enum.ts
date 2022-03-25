/**
 * Centralize error codes for this module.
 *
 * Exception should set their code to one of this enum entry.
 * An entry should be used by one and only one exception.
 *
 * Codes are documented here:
 * @see ../../../../back/_doc/erreurs.md
 */
export const enum CsmrTracksErrorCode {
  NOT_TRACKS_FOUND = 1,
  UNKNOWN_ACTION = 2,
  TRANSFORM_TRACKS_FAILED = 3,
  UNKNOWN_SP = 4,
}
