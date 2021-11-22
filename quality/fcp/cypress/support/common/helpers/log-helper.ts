export function clearBusinessLog(): void {
  const logFilePath = Cypress.env('LOG_FILE_PATH');
  cy.task('clearBusinessLog', { logFilePath }).should('eq', 0);
}

export enum LogResult {
  EventFound,
  UnexpectedError,
  Unknown,
  EventNotFound,
  EventMismatch,
}

export function hasBusinessLog(
  event: Record<string, unknown>,
  result: LogResult = LogResult.EventFound,
): void {
  const logFilePath = Cypress.env('LOG_FILE_PATH');
  cy.task('hasBusinessLog', { event, logFilePath }).should('eq', result);
}
