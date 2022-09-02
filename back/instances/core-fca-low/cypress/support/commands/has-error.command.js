export function hasError(errorCode) {
  cy.contains('h1', 'Une erreur est survenue lors de la connexion.');
  cy.contains('[data-testid="error-code"]', `Code d’erreur : ${errorCode}`);
}
