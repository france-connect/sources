/* istanbul ignore file */

export enum ErrorCode {
  LOW_ACR = 1,
  INVALID_ACR = 2,
  MISSING_CONTEXT = 3,
  MISSING_IDENTITY = 4,
  MISSING_AUTHENTICATION_EMAIL = 5,
  INVALID_IDENTITY = 6,
  /**
   * @todo core-fcp specific error, to be moved when we remove @fc/core
   */
  INVALID_CONSENT_PROCESS = 7,
  FAILED_PERSISTENCE = 8,
}
