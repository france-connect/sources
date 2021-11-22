/**
 * Centralize error codes for this module.
 *
 * Exception should set their code to one of this enum entry.
 * An entry should be used by one and only one exception.
 *
 * Codes are documented here:
 * @see https://confluence.kaliop.net/display/FC/Codes+erreurs+des+applications
 */
export const enum CsmrTracksErrorCode {
  NOT_TRACKS_FOUND = 1,
}
