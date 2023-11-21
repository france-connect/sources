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

export function getBusinessLogs(
  event: Record<string, unknown>,
  logPath?: string,
): Cypress.Chainable<Record<string, string>[]> {
  const logFilePath: string = logPath || Cypress.env('LOG_FILE_PATH');
  return cy.task<Record<string, string>[]>('getBusinessLogs', {
    event,
    logFilePath,
  });
}

export function getValueByKeyFromFirstEvent(
  key: string,
  logs: Record<string, string>[],
): string {
  expect(logs?.length).to.be.ok;
  const [firstEvent] = logs;
  const value = firstEvent[key];
  return value;
}
