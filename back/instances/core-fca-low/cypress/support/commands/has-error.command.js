export function hasError(errorCode) {
  cy.get('h1').contains('Une erreur est survenue lors de la connexion.');
  cy.get('#error-code').contains(`Code d’erreur : ${errorCode}`);
}
