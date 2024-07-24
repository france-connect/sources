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

export function getAllBusinessLogs(
  logPath?: string,
): Cypress.Chainable<Record<string, string>[]> {
  const logFilePath: string = logPath || Cypress.env('LOG_FILE_PATH');
  return cy.task<Record<string, string>[]>('getAllBusinessLogs', {
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

export function prepareEventVerification(
  text: string,
  delimitor: string,
  keyMapping: Record<string, string> = {},
  valueMapping: Record<string, unknown> = {},
): Record<string, unknown> {
  const expectedEvent = {};
  if (text) {
    text.split(delimitor).forEach((infoText) => {
      const result = infoText.match(/^"([^"]+)" "([^"]*)"$/);
      if (result) {
        const [, key, value] = result;
        const technicalKey = keyMapping[key] ?? key;
        let technicalValue: unknown = value;
        if (Object.keys(valueMapping).includes(value)) {
          technicalValue = valueMapping[value];
        } else if (value.startsWith('int:')) {
          technicalValue = parseInt(value.replace('int:', ''), 10);
        }
        expectedEvent[technicalKey] = technicalValue;
      }
    });
  }
  return expectedEvent;
}
