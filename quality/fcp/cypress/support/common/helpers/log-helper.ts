export enum LogResult {
  EventFound,
  UnexpectedError,
  Unknown,
  EventNotFound,
  EventMismatch,
}

export function clearBusinessLog(logPath?: string): void {
  const logFilePath: string = logPath || Cypress.env('LOG_FILE_PATH');
  cy.task('clearBusinessLog', { logFilePath }).should('eq', 0);
}

export function hasBusinessLog(
  event: Record<string, unknown>,
  result: LogResult = LogResult.EventFound,
  logPath?: string,
): void {
  const logFilePath: string = logPath || Cypress.env('LOG_FILE_PATH');
  cy.task<number>('hasBusinessLog', { event, logFilePath }).then((exitCode) => {
    const text = result === LogResult.EventFound ? 'be' : 'not be';
    expect(
      exitCode,
      `${JSON.stringify(event)} should ${text} present in the business log`,
    ).to.eq(result);
  });
}
