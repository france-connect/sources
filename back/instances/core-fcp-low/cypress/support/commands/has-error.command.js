export function hasError(errorCode) {
  cy.get('.main-title').contains('Une erreur technique est survenue lors de la connexion.');
  cy.get('#error-code').contains(`Code d'erreur : ${errorCode}`);
}
