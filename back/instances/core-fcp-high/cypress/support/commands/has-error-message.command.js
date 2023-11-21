export function hasErrorMessage(errorMessage, errorTitle = 'Que faire ?') {
  cy.contains('[data-testid="action"]', errorTitle);
  cy.contains('[data-testid="error-message"]', errorMessage);
}
