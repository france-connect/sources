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
  FOUND_ONLY_WITH_MARITAL_NAME = 7,
  NOT_FOUND_SINGLE_ECHO = 4,
  NOT_FOUND_MULTIPLE_ECHO = 6,
  NOT_FOUND_NO_ECHO = 8,
  REJECTED_BAD_REQUEST = 9,
  REQUEST_TIMEOUT = 11,
  HTTP_STATUS = 12,
  CITIZEN_STATUS_FORMAT = 13,
  DECEASED = 15,
}
