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
  FORMAT_TRACKS_FAILED = 1,
  AGGREGATION_FAILED = 2,
  CSMR_FAILED = 3,
  UNKNOWN_ACTION = 4,
  TRANSFORM_TRACKS_FAILED = 5,
  ACCOUNT_ID_CSMR_FAILED = 6,
  UNKNOWN_INSTANCE = 7,
}
