/* istanbul ignore file */

export enum ErrorCode {
  LOW_ACR = 1,
  INVALID_ACR = 2,
  MISSING_CONTEXT = 3,
  MISSING_IDENTITY = 4,
  MISSING_AUTHENTICATION_EMAIL = 5,
  INVALID_IDENTITY = 6,
  /**
   * @todo #992 suppression de la librairie @fc/core
   * core-fcp specific error, to be moved when we remove @fc/core
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/992
   */
  INVALID_CONSENT_PROCESS = 7,
  FAILED_PERSISTENCE = 8,
  CLAIM_AMR = 9,
  IDENTITY_PROVIDER_NOT_FOUND = 10,
  CORE_IDP_BLOCKED_FOR_ACCOUNT = 11,
  IDENTITY_CHECK_TOKEN = 13,
  DATA_PROVIDER_NOT_FOUND = 14,
  AGENT_NOT_FOUND = 15,
  INVALID_IDP_HINT = 16,
  HIGH_ACR = 18,
}
