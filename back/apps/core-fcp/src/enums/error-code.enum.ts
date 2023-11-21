/* istanbul ignore file */

// Declarative code
export enum ErrorCode {
  FAILED_ABORT_SESSION = 1,
  // To not colude with core exception, need to skip a lot of values
  FETCH_DATA_PROVIDER_JWKS_FAILED = 12,
  INVALID_ACCESS_TOKEN_FROM_DATA_PROVIDER = 13,
  FETCH_ACCESS_TOKEN_FROM_REDIS_FAILED = 14,
  MISSING_AT_HASH = 50,
}
