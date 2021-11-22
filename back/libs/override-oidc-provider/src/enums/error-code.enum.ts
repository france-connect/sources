/**
 * Centralize error codes for this module.
 *
 * Exception should set their code to one of this enum entry.
 * An entry should be used by one and only one exception.
 *
 * Codes are documented here:
 * @see https://confluence.kaliop.net/display/FC/Codes+erreurs+des+applications
 */
export enum ErrorCode {
  GATEWAY = 1,
  COMPUTE_IDENTITY_HASH = 2,
  INVALID_PAYLOAD_FORMAT = 3,
}
