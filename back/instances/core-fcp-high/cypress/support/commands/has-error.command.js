export function hasError(errorCode, errorTitle = 'Une erreur s’est produite') {
  cy.contains('[data-testid="error-section-title"]', errorTitle);
  cy.contains('[data-testid="error-code"]', `Erreur ${errorCode}`);
}
