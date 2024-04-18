export function hasError(errorCode) {
  cy.contains('h1', 'Accès impossible');
  cy.contains('[data-testid="error-code"]', `code erreur : ${errorCode}`);
}
