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
  UNKNOWN = 0,
  INIT_PROVIDER = 2,
  BINDING_PROVIDER = 4,
  STRINGIFY_FOR_REDIS = 5,
  PARSE_REDIS_RESPONSE = 6,
  AUTHORIZATION_ERROR = 7,
  BACKCHANNEL_ERROR = 8,
  JWKS_ERROR = 9,
  CHECK_SESSION_ORIGIN_ERROR = 10,
  CHECK_SESSION_ERROR = 11,
  DISCOVERY_ERROR = 12,
  END_SESSION_ERROR = 13,
  GRANT_ERROR = 14,
  INTROSPECTION_ERROR = 15,
  PUSHED_AUTHORIZATION_REQUEST_ERROR = 16,
  REGISTRATION_CREATE_ERROR = 17,
  REGISTRATION_DELETE_ERROR = 18,
  REGISTRATION_READ_ERROR = 19,
  REGISTRATION_UPDATE_ERROR = 20,
  REVOCATION_ERROR = 21,
  SERVER_ERROR = 22,
  USERINFO_ERROR = 23,
  INTERACTION_NOT_FOUND = 25,
  GRANT_NOT_SAVED = 26,
}
